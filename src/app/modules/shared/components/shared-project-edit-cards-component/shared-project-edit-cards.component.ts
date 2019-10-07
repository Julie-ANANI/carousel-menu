import { Component, Input, OnDestroy } from '@angular/core';
import { Innovation } from '../../../../models/innovation';
import { TranslationService } from '../../../../services/translation/translation.service';
import { forkJoin, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Media, Video } from '../../../../models/media';
import { takeUntil } from 'rxjs/operators';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { InnovCard } from '../../../../models/innov-card';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { DomSanitizer } from '@angular/platform-browser';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-shared-project-edit-cards',
  templateUrl: 'shared-project-edit-cards.component.html',
  styleUrls: ['shared-project-edit-cards.component.scss']
})

export class SharedProjectEditCardsComponent implements OnDestroy {

  @Input() innovation: Innovation;

  @Input() isEditable: boolean = false;

  @Input() isAdminSide: boolean = false;

  private _ngUnsubscribe: Subject<boolean> = new Subject();

  private _selectedCardIndex: number = 0;

  private _saveChanges: boolean = false;

  private _showModal: boolean = false;

  constructor(private _translationService: TranslationService,
              private _innovationService: InnovationService,
              private _innovationFrontService: InnovationFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              public domSanitizer: DomSanitizer) {

    this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._saveChanges = response;
    });

  }

  /***
   * this function is called when the user clicks on one of the lang,
   * and according to that we display the lang form.
   * @param event
   * @param index
   */
  public onLangChange(event: Event, index: number) {
    event.preventDefault();
    this._selectedCardIndex = index;
    this._innovationFrontService.setSelectedInnovationIndex(this._selectedCardIndex);
  }

  /***
   * this function is called when the user clicks on the delete language button. It
   * opens the modal to ask for the confirmation.
   * @param event
   */
  public onClickDelete(event: Event) {
    event.preventDefault();

    if (this.isEditable && this.innovation.innovationCards.length > 1) {
      this._showModal = true;
    }

  }

  /***
   * this function is called when the user tries to add the lang in the
   * project.
   * @param event
   * @param lang
   */
  public onCreateInnovationCard(event: Event, lang: string) {
    event.preventDefault();

    if (this.isEditable) {
      if (!this._saveChanges || this.isAdminSide) {
        if (this.innovation.innovationCards.length < 2 && this.innovation.innovationCards.length !== 0) {
          this._innovationService.createInnovationCard(this.innovation._id, new InnovCard({ lang: lang})).subscribe((data: InnovCard) => {
            this.innovation.innovationCards.push(data);
            this._selectedCardIndex = this.innovation.innovationCards.length - 1;
            this.onLangChange(event, this._selectedCardIndex);
            this.notifyChanges();
          });
        }
      } else {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
      }
    }

  }

  /***
   * this function is to notify all the changes that the user made
   * in the model.
   */
  public notifyChanges() {
    if (this.isEditable) {
      this._innovationFrontService.setNotifyChanges(true);
    }
  }

  public containsLanguage(lang: string): boolean {
    return this.innovation.innovationCards.some((c) => c.lang === lang);
  }

  /***
   * this function is called when the user clicks the submit button in the delete
   * modal, and it deletes the selected lang card.
   * @param event
   */
  public onClickConfirm(event: Event) {
    event.preventDefault();

    if (this.isEditable) {
      if (!this._saveChanges || this.isAdminSide) {
        this._innovationService.removeInnovationCard(this.innovation._id, this.innovation.innovationCards[this._selectedCardIndex]._id).subscribe(() => {
          this.innovation.innovationCards = this.innovation.innovationCards.filter((card) => card._id !== this.innovation.innovationCards[this._selectedCardIndex]._id);
          this.notifyChanges();
          this.onLangChange(event, 0);
          this._showModal = false;
          this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.DELETED_TEXT');
        }, () => {
          this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.NOT_DELETED_TEXT');
          this._showModal = false;
        });
      } else {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
      }
    }

  }

  /***
   * this function is to import translation. It works on admin side.
   * @param event
   * @param model
   */
  public importTranslation(event: Event, model: 'advantages' | 'title' | 'summary' | 'problem' | 'solution') {
    event.preventDefault();

    const target_card = this.innovation.innovationCards[this._selectedCardIndex];
    const from_card = this.innovation.innovationCards[this._selectedCardIndex === 0 ? 1 : 0];

    switch (model) {

      case 'advantages':
        const subs = from_card[model].map((a) => this._translationService.translate(a.text, target_card.lang));
        forkJoin(subs).subscribe(results => {
          target_card[model] = results.map((r) => { return {text: r.translation}; });
        });
        break;

      default:
        // remove html tags from text
        const text = from_card[model].replace(/<[^>]*>/g, '');
        this._translationService.translate(text, target_card.lang).subscribe((o) => {
          target_card[model] = o.translation;
        });

    }

  }

  /***
   * this function is called when the user edit the summary, problem
   * and solution.
   * @param event
   * @param cardProperty
   */
  public updateData(event: { content: string }, cardProperty:  'summary' | 'problem' | 'solution') {
    this.innovation.innovationCards[this._selectedCardIndex][cardProperty] = event.content;
    this.notifyChanges();
  }

  public getColor(length: number, limit: number) {
    return InnovationFrontService.getColor(length, limit);
  }

  /**
   * Add an advantage to the invention card
   * @param event the resulting value sent from the components directive
   * @param cardIdx this is the index of the innovation card being edited.
   */
  public updateAdvantage (event: { value: Array<{text: string }>}, cardIdx: number): void {
    this.innovation.innovationCards[cardIdx].advantages = event.value;
    this.notifyChanges();
  }

  public onChangeComment(event: Event) {
    event.preventDefault();
    if (this.allowAdminToComment) {
      this._innovationFrontService.setCardCommentNotifyChanges(true);
    }
  }

  /**
   * This configuration tells the directive what text to use for the placeholder and if it exists,
   * the initial data to show.
   * @param type
   * @returns {placeholder: string, initialData: string}
   */
  public config(type: string): any {

    const _inputConfig: any = {
      'advantages': {
        placeholder: 'SHARED_PROJECT_EDIT.DESCRIPTION.ADVANTAGES.INPUT',
        initialData: this.innovation.innovationCards[this._selectedCardIndex]['advantages']
      }
    };

    return _inputConfig[type] || {
      placeholder: 'Input',
      initialData: ''
    };

  }

  public mediaSrc(media: Media, requestFor: string): string {
    return InnovationFrontService.getMediaSrc(media, requestFor);
  }

  /***
   * this function is called when the user upload the images.
   * @param media
   * @param cardIdx
   */
  public uploadImage(media: Media, cardIdx: number): void {
    this.innovation.innovationCards[cardIdx].media.push(media);
    if (!this.innovation.innovationCards[cardIdx].principalMedia) {
      this.innovation.innovationCards[this._selectedCardIndex].principalMedia = media;
    }
    this.notifyChanges();
  }

  /***
   * this function is called when the user uploads the video.
   * @param video
   */
  public uploadVideo(video: Video): void {
    this._innovationService.addNewMediaVideoToInnovationCard(this.innovation._id, this.innovation.innovationCards[this._selectedCardIndex]._id, video)
      .subscribe(res => {
      this.innovation.innovationCards[this._selectedCardIndex].media.push(res);
      this.innovation.innovationCards[this._selectedCardIndex].principalMedia = res;
      this.notifyChanges();
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  /***
   * this function is called when the user clicks on the delete button to delete the media.
   * @param event
   * @param media
   * @param index
   */
  public onClickDeleteMedia(event: Event, media: Media, index: number) {
    event.preventDefault();

    this._innovationService.deleteMediaOfInnovationCard(this.innovation._id, this.innovation.innovationCards[index]._id, media._id)
      .subscribe((_res: Innovation) => {
        this.innovation.innovationCards[index].media = this.innovation.innovationCards[index].media.filter((m) => m._id !== media._id);

        if (this.innovation.innovationCards[index].principalMedia._id === media._id) {
          const randomMedia = this.innovation.innovationCards[this._selectedCardIndex].media[0];
          this.innovation.innovationCards[index].principalMedia = randomMedia;
        }

        this.notifyChanges();
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
      });

  }

  /***
   * this function is called when the user wants to make the media as primary media.
   * @param event
   * @param media
   * @param index
   */
  public onClickSetMainMedia(event: Event, media: Media, index: number) {
    event.preventDefault();

    this._innovationService.setPrincipalMediaOfInnovationCard(this.innovation._id, this.innovation.innovationCards[index]._id, media._id)
      .subscribe((res: Innovation) => {
        this.innovation.innovationCards[index].principalMedia = media;
        this.notifyChanges();
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
      });

  }

  get secondaryMedias(): Array<Media> {
    if (this.innovation && this.innovation.innovationCards[this._selectedCardIndex]
      && this.innovation.innovationCards[this._selectedCardIndex].media
      && this.innovation.innovationCards[this._selectedCardIndex].media.length > 0) {
      return this.innovation.innovationCards[this._selectedCardIndex].media.filter((media) => {

        if (this.innovation.innovationCards[this._selectedCardIndex].principalMedia && this.innovation.innovationCards[this._selectedCardIndex].principalMedia._id) {
          return media._id !== this.innovation.innovationCards[this._selectedCardIndex].principalMedia._id;
        }

        return media;

      });
    }
    return [];
  }

  public isVisible(field: string): boolean {
    if (this.innovation && this.innovation.innovationCards[this._selectedCardIndex]
      && this.innovation.innovationCards[this._selectedCardIndex].operatorComment && this.innovation.innovationCards[this._selectedCardIndex].operatorComment[field]) {
      return this.innovation.innovationCards[this._selectedCardIndex].operatorComment[field]
        && (this.innovation.innovationCards[this._selectedCardIndex].operatorComment[field].comment
          || this.innovation.innovationCards[this._selectedCardIndex].operatorComment[field].suggestion);
    }
    return false;
  }

  get allowAdminToComment(): boolean {
    return this.isAdminSide && this.innovation && (this.innovation.status === 'SUBMITTED' || this.innovation.status === 'EDITING');
  }

  get companyDomain(): string {
    return environment.domain;
  }

  get selectedCardIndex(): number {
    return this._selectedCardIndex;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
