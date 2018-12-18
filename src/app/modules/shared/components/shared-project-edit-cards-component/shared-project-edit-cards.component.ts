import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Innovation} from '../../../../models/innovation';
import {TranslationService} from '../../../../services/translation/translation.service';
import {forkJoin, Subject} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {Media, Video} from '../../../../models/media';
import {first, takeUntil} from 'rxjs/operators';
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
    this.innovation =  JSON.parse(JSON.stringify(value));
  }

  @Input() set editable(value: boolean) {
    this.canEdit = value;
  }

  @Input() set modeAdmin(value: boolean) {
    this.adminMode = value;
  }

  @Input() set sideAdmin(value: boolean) {
    this.adminSide = value;
  }

  @Output() pitchChange = new EventEmitter<Innovation>();

  innovation: Innovation;

  ngUnsubscribe: Subject<any> = new Subject();

  canEdit = false;

  adminMode = false;

  adminSide = false;

  selectedCardIndex = 0;

  companyName: string = environment.companyShortName;

  saveChanges = false;

  deleteModal = false;

  _editors: Array<any> = [];

  constructor(private translationService: TranslationService,
              private innovationService: InnovationService,
              private innovationCommonService: InnovationCommonService,
              private translateNotificationsService: TranslateNotificationsService,
              public domSanitizer: DomSanitizer) {}

  ngOnInit() {

    this.innovationCommonService.getNotifyChanges().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      this.saveChanges = response;
    });

    console.log(this.saveChanges);

  }


  /***
   * this function is to notify all the changes that the user made
   * in the model.
   */
  private notifyChanges() {
    this.innovationCommonService.setNotifyChanges(true);
    this.pitchChange.emit(this.innovation);
  }


  /***
   * this fucntion is called when the user clicks on one of the lang,
   * and according to that we display the lang form.
   * @param event
   * @param index
   */
  onLangSelect(event: Event, index: number) {
    event.preventDefault();
    this.selectedCardIndex = index;
  }


  /***
   * this function is called when the user tries to add the lang in the
   * project.
   * @param event
   * @param lang
   */
  onCreateInnovationCard(event: Event, lang: string) {
    event.preventDefault();

    if (this.canEdit) {
      if (!this.saveChanges) {
        if (this.innovation.innovationCards.length < 2 && this.innovation.innovationCards.length !== 0) {
          this.innovationService.createInnovationCard(this.innovation._id, new InnovCard({ lang: lang})).pipe(first()).subscribe((data: InnovCard) => {
            this.innovation.innovationCards.push(data);
            this.notifyChanges();
            this.selectedCardIndex = this.innovation.innovationCards.length - 1;
            this.onLangSelect(event, this.selectedCardIndex);
            this.notifyChanges();
          });
        }
      } else {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
      }
    }

  }


  containsLanguage(lang: string): boolean {
    return this.innovation.innovationCards.some((c) => c.lang === lang);
  }


  /***
   * this function is called when the user clicks on the delete language button. It
   * opens the modal to ask for the confirmation.
   * @param event
   */
  onClickDelete(event: Event) {
    event.preventDefault();
    this.deleteModal = true;
  }


  closeModal(event: Event) {
    event.preventDefault();
    this.deleteModal = false;
  }


  /***
   * this function is called when the user clicks the submit button in the delete
   * modal, and it deletes the selected lang card.
   * @param event
   */
  onClickSubmit(event: Event) {
    event.preventDefault();

    if (this.canEdit) {
      if ((!this.saveChanges)) {
        this.innovationService.removeInnovationCard(this.innovation._id, this.innovation.innovationCards[this.selectedCardIndex]._id).pipe(first()).subscribe(() => {
          this.innovation.innovationCards = this.innovation.innovationCards.filter((card) => card._id !== this.innovation.innovationCards[this.selectedCardIndex]._id);
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

    const target_card = this.innovation.innovationCards[this.selectedCardIndex];
    const from_card = this.innovation.innovationCards[this.selectedCardIndex === 0 ? 1 : 0];

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
      this.translationService.translate(text, target_card.lang).first().subscribe((o) => {
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
      this.innovation.innovationCards[this.selectedCardIndex].summary = event.content;
    } else if (event.id.indexOf('problem') !== -1) {
      this.innovation.innovationCards[this.selectedCardIndex].problem = event.content;
    } else if (event.id.indexOf('solution') !== -1) {
      this.innovation.innovationCards[this.selectedCardIndex].solution = event.content;
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
    this.innovation.innovationCards[cardIdx].advantages = event.value;
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
        initialData: this.innovation.innovationCards[this.selectedCardIndex]['advantages']
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
    this.innovation.innovationCards[cardIdx].media.push(media);
    this.checkPrincipalMedia(media, cardIdx);
    this.notifyChanges();
  }


  /***
   * this function is to make the uploaded image or video as a primary image automatically, if not.
   * @param media
   * @param cardIdx
   */
  checkPrincipalMedia(media: Media, cardIdx: number) {
    if (this.innovation.innovationCards[this.selectedCardIndex].media.length > 0) {
      if (!this.innovation.innovationCards[this.selectedCardIndex].principalMedia) {
        this.innovationService.setPrincipalMediaOfInnovationCard(this.innovation._id, this.innovation.innovationCards[this.selectedCardIndex]._id, media._id).pipe(first())
          .subscribe((res) => {
            this.innovation.innovationCards[cardIdx].principalMedia = media;
          });
      }
    }
  }


  /***
   * this function is called when the user uploads the video.
   * @param video
   */
  uploadVideo(video: Video): void {
    this.innovationService.addNewMediaVideoToInnovationCard(this.innovation._id, this.innovation.innovationCards[this.selectedCardIndex]._id, video).pipe(first())
      .subscribe(res => {
      this.innovation.innovationCards[this.selectedCardIndex].media.push(res);
      this.checkPrincipalMedia(res, this.selectedCardIndex);
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

    this.innovationService.deleteMediaOfInnovationCard(this.innovation._id, this.innovation.innovationCards[index]._id, media._id).pipe(first())
      .subscribe((_res: Innovation) => {
        this.innovation.innovationCards[index].media = this.innovation.innovationCards[index].media.filter((m) => m._id !== media._id);

        if (this.innovation.innovationCards[index].principalMedia._id === media._id) {
          this.innovation.innovationCards[index].principalMedia = null;
        }

        this.checkPrincipalMedia(this.innovation.innovationCards[this.selectedCardIndex].media[0], this.selectedCardIndex);
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

    this.innovationService.setPrincipalMediaOfInnovationCard(this.innovation._id, this.innovation.innovationCards[index]._id, media._id).pipe(first())
      .subscribe((res: Innovation) => {
        this.innovation.innovationCards[index].principalMedia = media;
        this.notifyChanges();
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });

  }


  ngOnDestroy(): void {
    if (Array.isArray(this._editors) && this._editors.length > 0) {
      this._editors.forEach((ed) => tinymce.remove(ed));
    }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }


}
