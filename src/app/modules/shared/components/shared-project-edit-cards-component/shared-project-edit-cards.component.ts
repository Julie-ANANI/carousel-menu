import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @Output() cardsChange = new EventEmitter<any>();
  @Output() saveChanges = new EventEmitter<boolean>();

  private ngUnsubscribe: Subject<any> = new Subject();
  private _companyName: string = environment.companyShortName;
  private _showDeleteModal = false;
  private _deleteInnovId = '';
  public innovationData: FormGroup; // Overall innovation
  private _primaryLanguage: string;
  private _primaryLength: number;
  private _displayDeleteButton = false;
  private _inputPreValue = '';
  private _inputCurrValue = '';
  /*
   * Gestion de l'affichage
   */
  public innovationCardEditingIndex = 0; // Index de l'innovationCard que l'on édite (système d'onglets)

  constructor(private _innovationService: InnovationService,
              private _authService: AuthService,
              private _domSanitizer: DomSanitizer,
              private _translateService: TranslateService,
              private _formBuilder: FormBuilder,
              private _translateNotificationService: TranslateNotificationsService) {
  }

  ngOnInit() {
    this._buildForm();

    this.changesSaved = true;

    this.innovationData.patchValue(this.project);

    this._primaryLanguage = this.project.innovationCards[0].lang;

    if (this.project.innovationCards.length < 2) {
      this._primaryLength = this.project.innovationCards.length;
    } else {
      this._displayDeleteButton = true;
    }

    if (!this.canEdit) {
      this.innovationData.disable();
    }

    for (const innovationCard of this.project.innovationCards) {
      this._addInnovationCardWithData(innovationCard);
    }

    this.innovationData.valueChanges
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(_ => {
        this.updateCards();
      });

  }

  private _buildForm(): void {
    this.innovationData = this._formBuilder.group({
      patented: [undefined, Validators.required],
      projectStatus: [undefined, Validators.required],
      external_diffusion: [false, [Validators.required]],
      innovationCards: this._formBuilder.array([])
    });
  }

  formProgress(event: Event, value: string) {

    if (event.target['type'] === 'radio') {
      if (event.target['name'] === 'projectStatus') {
        this._inputPreValue = this.innovationData.get('projectStatus').value;
      } else if (event.target['name'] === 'patented') {
        this._inputPreValue = this.innovationData.get('patented').value;
      } else {
        this._inputPreValue = this.innovationData.get('external_diffusion').value;
      }

      this._inputCurrValue = value;

      if (this._inputPreValue !== this._inputCurrValue) {
        this.changesSaved = true;
        this.saveChanges.emit(true);
      }

    } else {

      if (event.type === 'click') {
        this._inputPreValue = value;
      } else if (event.type === 'blur') {
        this._inputCurrValue = value;

        if (this._inputPreValue !== this._inputCurrValue) {
          this.changesSaved = false;
          this.saveChanges.emit(true);
        }

      }

    }

  }

  public updateCards() {
    this.cardsChange.emit(this.innovationData.value);
  }

  private _addInnovationCardWithData(innovationCardData: InnovCard): void {
    const innovationCards = this.innovationData.controls['innovationCards'] as FormArray;
    innovationCards.push(this._newInnovationCardFormBuilderGroup(innovationCardData));
  }

  /**
   * This configuration tells the directive what text to use for the placeholder and if it exists,
   * the initial data to show.
   * @param type
   * @returns {any|{placeholder: string, initialData: string}}
   */
  public getConfig(type: string): any {
    const _inputConfig = {
      'advantages': {
        placeholder: 'PROJECT_MODULE.SETUP.PITCH.DESCRIPTION.ADVANTAGES.INPUT',
        initialData: this.innovationData.get('innovationCards').value[this.innovationCardEditingIndex]['advantages']
      }
    };
    return _inputConfig[type] || {
        placeholder: 'Input',
        initialData: ''
      };
  }

  private _newInnovationCardFormBuilderGroup (data: InnovCard): any {
    return this._formBuilder.group({
      _id: [{value: data._id , disabled: !this.canEdit}, Validators.required],
      title: [{value: data.title, disabled: !this.canEdit}, Validators.required],
      summary: [{value: data.summary, disabled: !this.canEdit}, Validators.required],
      problem: [{value: data.problem, disabled: !this.canEdit}, Validators.required],
      solution: [{value: data.solution, disabled: !this.canEdit}, Validators.required],
      advantages: [{value: data.advantages, disabled: !this.canEdit}],
      lang: [{value: data.lang, disabled: !this.canEdit}, Validators.required],
      principal: [{value: data.principal, disabled: !this.canEdit}, Validators.required],
      media: [{value: data.media, disabled: !this.canEdit}, Validators.required]
    });
  }

  public createInnovationCard(event: Event, lang: string): void {
    event.preventDefault();

    if (this.canEdit) {

      if (this.project.innovationCards.length < 2 && this.project.innovationCards.length !== 0) {
        this._innovationService.createInnovationCard(this.project._id, {
          lang: lang
        }).first()
          .subscribe((data: InnovCard) => {
            window.location.reload();
          });
      }

      if (this.changesSaved) {
      } else {
        this._translateNotificationService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
      }

    }

  }

  /**
   * Add an advantage to the invention card
   * @param event the resulting value sent from the components directive
   * @param cardIdx this is the index of the innovation card being edited.
   */
  public addAdvantageToInventionCard (event: {value: Array<string>}, cardIdx: number): void {
    const card = this.innovationData.get('innovationCards').value[cardIdx] as FormGroup;
    card['advantages'] = event.value;
    this.updateCards();
    this.changesSaved = false;
    this.saveChanges.emit(true);
  }

  public setAsPrincipal (innovationCardId: string): void {
    this.innovationData.get('innovationCards').value.forEach((innovCard: any, index: number) => {
      this.innovationData.get('innovationCards').get([index]).get('principal')
        .patchValue(innovCard._id === innovationCardId);
    });

  }

  public imageUploaded(media: Media, cardIdx: number): void {
    const card = this.innovationData.get('innovationCards').value[cardIdx] as FormGroup;
    card['media'].push(media);
    // this.updateCards();
    // this.projectChange.emit(this.project);
  }

  public newOnlineVideoToAdd (videoInfos: Video): void {
    this._innovationService.addNewMediaVideoToInnovationCard(this.project._id,
      this.project.innovationCards[this.innovationCardEditingIndex]._id, videoInfos)
      .first().subscribe(res => {
        this.project = res;
        this.projectChange.emit(this.project);
      });
  }

  public setMediaAsPrimary (event: Event, media: Media, index: number): void {
    event.preventDefault();

    this.innovationCardEditingIndex = index;

    this.setAsPrincipal(this.project.innovationCards[this.innovationCardEditingIndex]._id);

    this._innovationService.setPrincipalMediaOfInnovationCard(this.project._id,
      this.project.innovationCards[this.innovationCardEditingIndex]._id, media._id)
      .first().subscribe((res: Innovation) => {
        this.project = res;
        this.projectChange.emit(this.project);
      });

  }

  public deleteMedia(event: Event, media: Media, index: number): void {
    event.preventDefault();

    this.innovationCardEditingIndex = index;

    this.setAsPrincipal(this.project.innovationCards[this.innovationCardEditingIndex]._id);

    this._innovationService.deleteMediaOfInnovationCard(this.project._id,
      this.project.innovationCards[this.innovationCardEditingIndex]._id, media._id)
      .first().subscribe((res: Innovation) => {
        this.project = res;
        this.projectChange.emit(this.project);
        this.innovationData.patchValue(this.project);
      });

  }

  public deleteModal(innovID: string) {

    if (this.canEdit) {
      this._deleteInnovId = innovID;
      this._showDeleteModal = true;

      if (this.changesSaved) {

      } else {
        this._translateNotificationService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
      }
    }

  }

  public deleteInnov(event: Event) {
    event.preventDefault();

    this._innovationService.removeInnovationCard(this.project._id, this._deleteInnovId).subscribe((res) => {
      window.location.reload();
    }, err => {
      this._translateNotificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
    });

  }

  public closeModal(event: Event) {
    event.preventDefault();
    this._showDeleteModal = false;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get domSanitizer() {
    return this._domSanitizer;
  }

  get companyName(){
    return (this._companyName || 'umi').toLocaleUpperCase();
  }

  get primaryLanguage(): string {
    return this._primaryLanguage;
  }

  get inputPreValue(): string {
    return this._inputPreValue;
  }

  get inputCurrValue(): string {
    return this._inputCurrValue;
  }

  get primaryLength(): number {
    return this._primaryLength;
  }

  get displayDeleteButton(): boolean {
    return this._displayDeleteButton;
  }

  get showDeleteModal(): boolean {
    return this._showDeleteModal;
  }

  get deleteInnovId(): string {
    return this._deleteInnovId;
  }

  get canEdit(): boolean {
    return this.project && (this.project.status === 'EDITING' || this.isAdmin);
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get isAdmin(): boolean {
    return (this._authService.adminLevel & 3) === 3;
  }

}
