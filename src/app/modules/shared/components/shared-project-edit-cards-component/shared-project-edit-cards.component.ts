import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Innovation} from '../../../../models/innovation';
import {TranslationService} from '../../../../services/translation/translation.service';
import {forkJoin, Subject} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {Media, Video} from '../../../../models/media';
import { takeUntil } from 'rxjs/operators';
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {InnovCard} from '../../../../models/innov-card';
import {InnovationCommonService} from '../../../../services/innovation/innovation-common.service';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';
import {DomSanitizer} from '@angular/platform-browser';

declare const tinymce: any;

@Component({
  selector: 'app-shared-project-edit-cards',
  templateUrl: 'shared-project-edit-cards.component.html',
  styleUrls: ['shared-project-edit-cards.component.scss']
})

export class SharedProjectEditCardsComponent implements OnInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this._innovation =  JSON.parse(JSON.stringify(value));
  }

  @Input() set editable(value: boolean) {
    this._canEdit = value;
  }

  @Input() set modeAdmin(value: boolean) {
    this._adminMode = value;
  }

  @Input() set sideAdmin(value: boolean) {
    this._adminSide = value;
  }

  @Output() pitchChange = new EventEmitter<Innovation>();

  private _innovation: Innovation;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _canEdit = false;

  private _adminMode = false;

  private _adminSide = false;

  private _selectedCardIndex = 0;

  private _companyName: string = environment.companyShortName;

  private _saveChanges = false;

  private _deleteModal = false;

  private _editors: Array<any> = [];

  constructor(private translationService: TranslationService,
              private innovationService: InnovationService,
              private innovationCommonService: InnovationCommonService,
              private translateNotificationsService: TranslateNotificationsService,
              public domSanitizer: DomSanitizer) {}

  ngOnInit() {

    this.innovationCommonService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._saveChanges = response;
    });

  }


  /***
   * this function is to notify all the changes that the user made
   * in the model.
   */
  private notifyChanges() {
    this.innovationCommonService.setNotifyChanges(true);
    this.pitchChange.emit(this._innovation);
  }


  /***
   * this fucntion is called when the user clicks on one of the lang,
   * and according to that we display the lang form.
   * @param event
   * @param index
   */
  onLangSelect(event: Event, index: number) {
    event.preventDefault();
    this._selectedCardIndex = index;
    this.innovationCommonService.setSelectedInnovationIndex(this._selectedCardIndex);
  }


  /***
   * this function is called when the user tries to add the lang in the
   * project.
   * @param event
   * @param lang
   */
  onCreateInnovationCard(event: Event, lang: string) {
    event.preventDefault();

    if (this._canEdit) {
      if (!this._saveChanges || this._adminSide) {
        if (this._innovation.innovationCards.length < 2 && this._innovation.innovationCards.length !== 0) {
          this.innovationService.createInnovationCard(this._innovation._id, new InnovCard({ lang: lang})).subscribe((data: InnovCard) => {
            this._innovation.innovationCards.push(data);
            this.notifyChanges();
            this._selectedCardIndex = this._innovation.innovationCards.length - 1;
            this.onLangSelect(event, this._selectedCardIndex);
            this.notifyChanges();
          });
        }
      } else {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
      }
    }

  }


  containsLanguage(lang: string): boolean {
    return this._innovation.innovationCards.some((c) => c.lang === lang);
  }


  /***
   * this function is called when the user clicks on the delete language button. It
   * opens the modal to ask for the confirmation.
   * @param event
   */
  onClickDelete(event: Event) {
    event.preventDefault();
    this._deleteModal = true;
  }


  closeModal(event: Event) {
    event.preventDefault();
    this._deleteModal = false;
  }


  /***
   * this function is called when the user clicks the submit button in the delete
   * modal, and it deletes the selected lang card.
   * @param event
   */
  onClickSubmit(event: Event) {
    event.preventDefault();

    if (this._canEdit) {
      if (!this._saveChanges || this._adminSide) {
        this.innovationService.removeInnovationCard(this._innovation._id, this._innovation.innovationCards[this._selectedCardIndex]._id).subscribe(() => {
          this._innovation.innovationCards = this._innovation.innovationCards.filter((card) => card._id !== this._innovation.innovationCards[this._selectedCardIndex]._id);
          this.notifyChanges();
          this.onLangSelect(event, 0);
          this.closeModal(event);
          this.translateNotificationsService.error('ERROR.SUCCESS', 'ERROR.PROJECT.DELETED_TEXT');
        }, () => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.NOT_DELETED_TEXT');
          this.closeModal(event);
        })
      } else {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
      }
    }

  }


  /***
   * this function is to import translation. It works on admin side.
   * @param event
   * @param model
   */
  importTranslation(event: Event, model: string) {
    event.preventDefault();

    const target_card = this._innovation.innovationCards[this._selectedCardIndex];
    const from_card = this._innovation.innovationCards[this._selectedCardIndex === 0 ? 1 : 0];

    switch (model) {

      case 'advantages':
        const subs = from_card[model].map((a) => this.translationService.translate(a.text, target_card.lang));
        forkJoin(subs).subscribe(results => {
          target_card[model] = results.map((r) => { return {text: r.translation}; });

        });
        break;

      default:
        // remove html tags from text
        const text = from_card[model].replace(/<[^>]*>/g, '');
        this.translationService.translate(text, target_card.lang).subscribe((o) => {
          target_card[model] = o.translation;
        });

    }

  }


  /***
   * this function is called when the user edit the summary, problem
   * and solution.
   * @param event
   */
  updateData(event: { id: string, content: string }) {
    this.notifyChanges();

    if (event.id.indexOf('summary') !== -1) {
      this._innovation.innovationCards[this._selectedCardIndex].summary = event.content;
    } else if (event.id.indexOf('problem') !== -1) {
      this._innovation.innovationCards[this._selectedCardIndex].problem = event.content;
    } else if (event.id.indexOf('solution') !== -1) {
      this._innovation.innovationCards[this._selectedCardIndex].solution = event.content;
    }

  }


  getColor(length: number) {
    if (length <= 0) {
      return '#EA5858';
    } else if (length > 0 && length < 250) {
      return '#f0ad4e';
    } else {
      return '#2ECC71';
    }
  }


  /**
   * Add an advantage to the invention card
   * @param event the resulting value sent from the components directive
   * @param cardIdx this is the index of the innovation card being edited.
   */
  updateAdvantage (event: { value: Array<{text: string }>}, cardIdx: number): void {
    this._innovation.innovationCards[cardIdx].advantages = event.value;
    this.notifyChanges();
  }


  /**
   * This configuration tells the directive what text to use for the placeholder and if it exists,
   * the initial data to show.
   * @param type
   * @returns {any|{placeholder: string, initialData: string}}
   */
  getConfig(type: string): any {
    const _inputConfig = {
      'advantages': {
        placeholder: 'PROJECT_MODULE.SETUP.PITCH.DESCRIPTION.ADVANTAGES.INPUT',
        initialData: this._innovation.innovationCards[this._selectedCardIndex]['advantages']
      }
    };
    return _inputConfig[type] || {
      placeholder: 'Input',
      initialData: ''
    };
  }


  /***
   * this function is called when the user upload the images.
   * @param media
   * @param cardIdx
   */
  uploadImage(media: Media, cardIdx: number): void {
    this._innovation.innovationCards[cardIdx].media.push(media);
    this.checkPrincipalMedia(media, cardIdx);
    this.notifyChanges();
  }


  /***
   * this function is to make the uploaded image or video as a primary image automatically, if not.
   * @param media
   * @param cardIdx
   */
  checkPrincipalMedia(media: Media, cardIdx: number) {
    if (this._innovation.innovationCards[this._selectedCardIndex].media.length > 0) {
      if (!this._innovation.innovationCards[this._selectedCardIndex].principalMedia) {
        this.innovationService.setPrincipalMediaOfInnovationCard(this._innovation._id, this._innovation.innovationCards[this._selectedCardIndex]._id, media._id)
          .subscribe((res) => {
            this._innovation.innovationCards[cardIdx].principalMedia = media;
          });
      }
    }
  }


  /***
   * this function is called when the user uploads the video.
   * @param video
   */
  uploadVideo(video: Video): void {
    this.innovationService.addNewMediaVideoToInnovationCard(this._innovation._id, this._innovation.innovationCards[this._selectedCardIndex]._id, video)
      .subscribe(res => {
      this._innovation.innovationCards[this._selectedCardIndex].media.push(res);
      this.checkPrincipalMedia(res, this._selectedCardIndex);
      this.notifyChanges();
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  /***
   * this function is called when the user clicks on the delete button to delete the media.
   * @param event
   * @param media
   * @param index
   */
  onClickDeleteMedia(event: Event, media: Media, index: number) {
    event.preventDefault();

    this.innovationService.deleteMediaOfInnovationCard(this._innovation._id, this._innovation.innovationCards[index]._id, media._id)
      .subscribe((_res: Innovation) => {
        this._innovation.innovationCards[index].media = this._innovation.innovationCards[index].media.filter((m) => m._id !== media._id);

        if (this._innovation.innovationCards[index].principalMedia._id === media._id) {
          this._innovation.innovationCards[index].principalMedia = null;
        }

        this.checkPrincipalMedia(this._innovation.innovationCards[this._selectedCardIndex].media[0], this._selectedCardIndex);
        this.notifyChanges();
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });

  }


  /***
   * this function is called when the user wants to make the media as primary media.
   * @param event
   * @param media
   * @param index
   */
  onClickSetMainMedia(event: Event, media: Media, index: number) {
    event.preventDefault();

    this.innovationService.setPrincipalMediaOfInnovationCard(this._innovation._id, this._innovation.innovationCards[index]._id, media._id)
      .subscribe((res: Innovation) => {
        this._innovation.innovationCards[index].principalMedia = media;
        this.notifyChanges();
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });

  }


  get innovation(): Innovation {
    return this._innovation;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

  get adminMode(): boolean {
    return this._adminMode;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

  get selectedCardIndex(): number {
    return this._selectedCardIndex;
  }

  get companyName(): string {
    return this._companyName;
  }

  get saveChanges(): boolean {
    return this._saveChanges;
  }

  get deleteModal(): boolean {
    return this._deleteModal;
  }

  get editors(): Array<any> {
    return this._editors;
  }

  ngOnDestroy(): void {
    if (Array.isArray(this._editors) && this._editors.length > 0) {
      this._editors.forEach((ed) => tinymce.remove(ed));
    }

    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();

  }


}
