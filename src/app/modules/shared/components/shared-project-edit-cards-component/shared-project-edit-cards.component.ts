import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Media, Video } from '../../../../models/media';
import { Innovation } from '../../../../models/innovation';
import { InnovCard } from '../../../../models/innov-card';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { environment } from '../../../../../environments/environment';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-shared-project-edit-cards',
  templateUrl: 'shared-project-edit-cards.component.html',
  styleUrls: ['shared-project-edit-cards.component.scss']
})

export class SharedProjectEditCardsComponent implements OnInit, OnDestroy {

  @Input() project: Innovation;
  @Input() changesSaved: boolean;

  @Output() projectChange = new EventEmitter<any>();
  @Output() saveChanges = new EventEmitter<boolean>();
  @Output() pitchFormField = new EventEmitter<boolean>();

  advantageInputError: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();
  private _companyName: string = environment.companyShortName;
  private _showDeleteModal = false;
  private _deleteInnovCardId = '';
  private _langDelete = '';
  /*
   * Gestion de l'affichage
   */
  public innovationCardEditingIndex = 0; // Index de l'innovationCard que l'on édite (système d'onglets)

  constructor(private innovationService: InnovationService,
              private authService: AuthService,
              private domSanitizer1: DomSanitizer,
              private translateService: TranslateService,
              private translateNotificationsService: TranslateNotificationsService) {
  }

  ngOnInit() {
    this.changesSaved = true;
    this.checkField();
  }

  notifyModelChanges(_event: any) {
    this.changesSaved = false;
    this.saveChanges.emit(true);
    this.checkField();
  }

  checkField() {
    if (this.project.innovationCards[this.innovationCardEditingIndex].title !== '' && this.project.innovationCards[this.innovationCardEditingIndex].summary !== ''
      && this.project.innovationCards[this.innovationCardEditingIndex].problem !== '' && this.project.innovationCards[this.innovationCardEditingIndex].solution !== ''
      && this.project.innovationCards[this.innovationCardEditingIndex].advantages.length !== 0) {
      this.pitchFormField.emit(true);
    } else {
      this.pitchFormField.emit(false);
    }
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
          this.innovationService.createInnovationCard(this.project._id, {
            lang: lang
          }).first().subscribe((data: InnovCard) => {
            this.project.innovationCards.push(data);
            this.innovationCardEditingIndex = this.project.innovationCards.length - 1;
            this.projectChange.emit(this.project);
          });
        }
      } else {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
      }

    }

  }

  /**
   * Add an advantage to the invention card
   * @param event the resulting value sent from the components directive
   * @param cardIdx this is the index of the innovation card being edited.
   */
  addAdvantageToInventionCard (event: {value: Array<{text: string}>}, cardIdx: number): void {
    this.project.innovationCards[cardIdx].advantages = event.value;
    this.notifyModelChanges(event.value);
    console.log(event);
    if (this.project.innovationCards[this.innovationCardEditingIndex].advantages.length === 0) {
      this.advantageInputError = true;
    } else {
      this.advantageInputError = false;
    }
  }

  setAsPrincipal (innovationCardId: string): void {
    this.project.innovationCards.forEach((innovCard: any) => {
      innovCard.principal = (innovCard._id === innovationCardId);
    });
  }

  imageUploaded(media: Media, cardIdx: number): void {
    this.project.innovationCards[cardIdx].media.push(media);
    // this.projectChange.emit(this.project);
    if (this.innovationCardEditingIndex === 0) {
      if (this.project.principalMedia === null || this.project.principalMedia === undefined) {
       this.innovationService.setPrincipalMediaOfInnovationCard(this.project._id, this.project.innovationCards[0]._id, media._id).first().subscribe((res) => {
         this.projectChange.emit(this.project);
       });
      }
    }

  }

  newOnlineVideoToAdd (videoInfos: Video): void {
    this.innovationService.addNewMediaVideoToInnovationCard(this.project._id,
      this.project.innovationCards[this.innovationCardEditingIndex]._id, videoInfos)
      .first().subscribe(res => {
        this.project.innovationCards[this.innovationCardEditingIndex].media.push(res);
        this.projectChange.emit(this.project);
      });
  }

  setMediaAsPrimary (event: Event, media: Media, index: number): void {
    event.preventDefault();

    this.innovationService.setPrincipalMediaOfInnovationCard(this.project._id,
      this.project.innovationCards[index]._id, media._id)
      .first().subscribe((res: Innovation) => {
        this.project.innovationCards[index].principalMedia = media;
        this.projectChange.emit(this.project);
      });

  }

  deleteMedia(event: Event, media: Media, index: number): void {
    event.preventDefault();

    this.innovationCardEditingIndex = index;

    this.innovationService.deleteMediaOfInnovationCard(this.project._id,
      this.project.innovationCards[index]._id, media._id)
      .first().subscribe((_res: Innovation) => {
        this.project.innovationCards[index].media = this.project.innovationCards[index].media.filter((m) => m._id !== media._id);
        this.projectChange.emit(this.project);
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
    this.innovationService.removeInnovationCard(this.project._id, this._deleteInnovCardId).subscribe((res) => {
      this.project.innovationCards = this.project.innovationCards.filter((card) => card._id !== this._deleteInnovCardId);
      this.innovationCardEditingIndex -= 1;
      this._showDeleteModal = false;
    }, err => {
      this.translateNotificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      this._showDeleteModal = false;
    });

  }

  closeModal(event: Event) {
    event.preventDefault();
    this._showDeleteModal = false;
  }

  valueCheck(event: Event) {

  }

  getColor(length: number) {
    if (length === 0) {
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

  get canEdit(): boolean {
    return this.project && (this.project.status === 'EDITING' || this.isAdmin);
  }

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get isAdmin(): boolean {
    return (this.authService.adminLevel & 3) === 3;
  }

}
