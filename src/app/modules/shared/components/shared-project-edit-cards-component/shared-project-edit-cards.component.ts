import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Media, Video } from '../../../../models/media';
import { Innovation } from '../../../../models/innovation';
import { InnovCard } from '../../../../models/innov-card';
import { Subject } from 'rxjs/Subject';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { environment } from '../../../../../environments/environment';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslationService } from '../../../../services/translation/translation.service';

declare const tinymce: any;

@Component({
  selector: 'app-shared-project-edit-cards',
  templateUrl: 'shared-project-edit-cards.component.html',
  styleUrls: ['shared-project-edit-cards.component.scss']
})

export class SharedProjectEditCardsComponent implements OnInit, OnDestroy {

  @Input() project: Innovation;
  @Input() canEdit: Boolean;
  @Input() sidebar: Boolean;
  @Input() changesSaved: boolean;
  @Input() showPitchFieldError: Subject<boolean>;

  @Output() projectChange = new EventEmitter<any>();
  @Output() saveChanges = new EventEmitter<boolean>();
  @Output() innovationToPreview = new EventEmitter<number>();

  private _showTitleError: boolean;
  private _showSummaryError: boolean;
  private _showProblemError: boolean;
  private _showSolutionError: boolean;
  private _showAdvantageError: boolean;
  private _showPatentError: boolean;
  private _showDiffusionError: boolean;

  private _adminSide = false;
  private _adminMode = false;

  private ngUnsubscribe: Subject<any> = new Subject();
  private _companyName: string = environment.companyShortName;

  private _showDeleteModal = false;
  private _deleteInnovCardId = '';
  private _langDelete = '';

  private _editors: Array<any> = [];

  /*
   * Gestion de l'affichage
   */
  public innovationCardEditingIndex = 0; // Index de l'innovationCard que l'on édite (système d'onglets)

  constructor(private innovationService: InnovationService,
              private authService: AuthService,
              private domSanitizer1: DomSanitizer,
              private translateService: TranslateService,
              private translationService: TranslationService,
              private translateNotificationsService: TranslateNotificationsService,
              private location: Location) {
  }

  ngOnInit() {
    this.changesSaved = true;

    this.isAdmin();

    if (!this._adminSide) {
      this.showPitchFieldError.subscribe(value => {
        if (value) {
          this.showError();
        }
      });
      this.sidebar = false;
    }

  }

  isAdmin() {
    this._adminSide = this.location.path().slice(0, 6) === '/admin';
    this._adminMode = (this.authService.adminLevel & 3) === 3;
  }

  notifyModelChanges(_event?: any) {
    this.changesSaved = false;
    this.saveChanges.emit(true);
    this.projectChange.emit(this.project);
  }

  showError() {
    this._showTitleError = this.project.innovationCards[this.innovationCardEditingIndex].title === '';
    this._showSummaryError = this.project.innovationCards[this.innovationCardEditingIndex].summary === '';
    this._showProblemError = this.project.innovationCards[this.innovationCardEditingIndex].problem === '';
    this._showSolutionError = this.project.innovationCards[this.innovationCardEditingIndex].solution === '';
    this._showAdvantageError = this.project.innovationCards[this.innovationCardEditingIndex].advantages.length === 0;
    this._showPatentError = this.project.patented === null;
    this._showDiffusionError = this.project.external_diffusion === null;
  }

  /*
      Resetting the value of all errors when we switch between the languages.
   */
  resetErrorValue() {
    this._showTitleError = false;
    this._showSummaryError = false;
    this._showProblemError = false;
    this._showSolutionError = false;
    this._showAdvantageError = false;
    this._showPatentError = false;
    this._showDiffusionError = false;
  }

  onLangSelect(event: Event, index: number) {
    event.preventDefault();
    this.innovationCardEditingIndex = index;
    this.resetErrorValue();
    this.innovationToPreview.emit(this.innovationCardEditingIndex);
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
        initialData: this.project.innovationCards[this.innovationCardEditingIndex]['advantages']
      }
    };
    return _inputConfig[type] || {
        placeholder: 'Input',
        initialData: ''
      };
  }

  createInnovationCard(event: Event, lang: string): void {
    event.preventDefault();

    if (this.canEdit) {
      if (this.changesSaved) {
        if (this.project.innovationCards.length < 2 && this.project.innovationCards.length !== 0) {
          this.innovationService.createInnovationCard(this.project._id, new InnovCard({
            lang: lang
          })).first().subscribe((data: InnovCard) => {
            this.project.innovationCards.push(data);
            this.innovationCardEditingIndex = this.project.innovationCards.length - 1;
            this.notifyModelChanges(event);
            this.onLangSelect(event, this.innovationCardEditingIndex);
          });
        }
      } else {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
      }
    }

  }

  updateData(event: {id: string, content: string}) {
    if (event.id.indexOf('summary') !== -1) {
      this.project.innovationCards[this.innovationCardEditingIndex].summary = event.content;
    } else if (event.id.indexOf('problem') !== -1) {
      this.project.innovationCards[this.innovationCardEditingIndex].problem = event.content;
    } else if (event.id.indexOf('solution') !== -1) {
      this.project.innovationCards[this.innovationCardEditingIndex].solution = event.content;
    }
    this.notifyModelChanges();
  }

  /**
   * Add an advantage to the invention card
   * @param event the resulting value sent from the components directive
   * @param cardIdx this is the index of the innovation card being edited.
   */
  addAdvantageToInventionCard (event: {value: Array<{text: string}>}, cardIdx: number): void {
    this.project.innovationCards[cardIdx].advantages = event.value;
    this.notifyModelChanges(event.value);
    this._showAdvantageError = (this.project.innovationCards[this.innovationCardEditingIndex].advantages.length === 0);
  }

  setAsPrincipal (innovationCardId: string): void {
    this.project.innovationCards.forEach((innovCard: any) => {
      innovCard.principal = (innovCard._id === innovationCardId);
    });
  }

  imageUploaded(media: Media, cardIdx: number): void {
    this.project.innovationCards[cardIdx].media.push(media);
    this.checkPrincipalMedia(media, cardIdx);
  }

  newOnlineVideoToAdd (videoInfos: Video): void {
    this.innovationService.addNewMediaVideoToInnovationCard(this.project._id,
      this.project.innovationCards[this.innovationCardEditingIndex]._id, videoInfos)
      .first().subscribe(res => {
        this.project.innovationCards[this.innovationCardEditingIndex].media.push(res);
        this.checkPrincipalMedia(res, this.innovationCardEditingIndex);
      });

  }

  checkPrincipalMedia(media: Media, cardIdx: number) {
    if (this.project.innovationCards[this.innovationCardEditingIndex].media.length > 0) {
      if (!this.project.innovationCards[this.innovationCardEditingIndex].principalMedia) {
        this.innovationService.setPrincipalMediaOfInnovationCard(this.project._id,
          this.project.innovationCards[this.innovationCardEditingIndex]._id, media._id).first()
          .subscribe((res) => {
            this.project.innovationCards[cardIdx].principalMedia = media;
          });
      }
    }
  }

  setMediaAsPrimary (event: Event, media: Media, index: number): void {
    event.preventDefault();

    this.innovationService.setPrincipalMediaOfInnovationCard(this.project._id,
      this.project.innovationCards[index]._id, media._id)
      .first().subscribe((res: Innovation) => {
        this.project.innovationCards[index].principalMedia = media;
      });

  }

  deleteMedia(event: Event, media: Media, index: number): void {
    event.preventDefault();

    this.innovationService.deleteMediaOfInnovationCard(this.project._id,
      this.project.innovationCards[index]._id, media._id)
      .first().subscribe((_res: Innovation) => {
        this.project.innovationCards[index].media = this.project.innovationCards[index].media.filter((m) => m._id !== media._id);
        if (this.project.innovationCards[index].principalMedia._id === media._id) {
          this.project.innovationCards[index].principalMedia = null;
        }
        this.projectChange.emit(this.project);
        this.checkPrincipalMedia(this.project.innovationCards[this.innovationCardEditingIndex].media[0],
        this.innovationCardEditingIndex);
      });

  }

  deleteModal(innovcardID: string, lang: string) {
    if (this.canEdit) {
      if (this.changesSaved) {
        this._deleteInnovCardId = innovcardID;
        this._langDelete = lang;
        this._showDeleteModal = true;
      } else {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
      }
    }
  }

  deleteInnovCard(event: Event) {
    event.preventDefault();
    this.innovationService.removeInnovationCard(this.project._id, this._deleteInnovCardId)
      .subscribe((res) => {
      this.project.innovationCards = this.project.innovationCards.filter((card) => card._id !== this._deleteInnovCardId);
      // this.innovationCardEditingIndex -= 1;
      this._showDeleteModal = false;
      this.notifyModelChanges(event);
      this.onLangSelect(event, 0);
    }, err => {
      this.translateNotificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      this._showDeleteModal = false;
    });
  }

  importTranslation(event: Event, model: string) {
    event.preventDefault();
    const target_card = this.project.innovationCards[this.innovationCardEditingIndex];
    const from_card = this.project.innovationCards[this.innovationCardEditingIndex === 0 ? 1 : 0];
    switch (model) {
      case 'advantages':
        const subs = from_card[model].map((a) => this.translationService.translate(a.text, target_card.lang));
        forkJoin(subs).subscribe(results => {
          target_card[model] = results.map((r) => { return {text: r.translation}; });
          this.notifyModelChanges();
        });
        break;
      default:
        // remove html tags from text
        const text = from_card[model].replace(/<[^>]*>/g, '');
        this.translationService.translate(text, target_card.lang).first().subscribe((o) => {
          target_card[model] = o.translation;
          this.notifyModelChanges();
        });
    }
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._showDeleteModal = false;
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

  containsLanguage(lang: string): boolean {
    return this.project.innovationCards.some((c) => c.lang === lang);
  }

  ngOnDestroy() {
    if (Array.isArray(this._editors) && this._editors.length > 0) {
      this._editors.forEach((ed) => tinymce.remove(ed));
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get domSanitizer() {
    return this.domSanitizer1;
  }

  get companyName(){
    return (this._companyName || 'umi').toLocaleUpperCase();
  }

  get showDeleteModal(): boolean {
    return this._showDeleteModal;
  }

  get langDelete(): string {
    return this._langDelete;
  }

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get showTitleError(): boolean {
    return this._showTitleError;
  }

  set showTitleError(value: boolean) {
    this._showTitleError = value;
  }

  get showSummaryError(): boolean {
    return this._showSummaryError;
  }

  get showProblemError(): boolean {
    return this._showProblemError;
  }

  get showSolutionError(): boolean {
    return this._showSolutionError;
  }

  get showAdvantageError(): boolean {
    return this._showAdvantageError;
  }

  get showPatentError(): boolean {
    return this._showPatentError;
  }

  get showDiffusionError(): boolean {
    return this._showDiffusionError;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

  get adminMode(): boolean {
    return this._adminMode;
  }

  set adminMode(value: boolean) {
    this._adminMode = value;
  }

}
