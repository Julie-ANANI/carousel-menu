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
  @Output() projectChange = new EventEmitter<any>();
  @Output() cardsChange = new EventEmitter<any>();
  @Output() saveChanges = new EventEmitter<boolean>();

  public innovationData: FormGroup; // Overall innovation
  private ngUnsubscribe: Subject<any> = new Subject();
  private _companyName: string = environment.companyShortName;
  private _primaryLanguage: string;
  innovProgress: number;
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

    this.innovationData.patchValue(this.project);

    if (this.project.innovationCards.length < 2) {
      this._primaryLanguage = this.project.innovationCards[0].lang;
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

  public updateCards() {
    this.cardsChange.emit(this.innovationData.value);
    this.saveChanges.emit(true);
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
      id: [{value: data._id, disabled: !this.canEdit}, Validators.required],
      title: [{value: data.title, disabled: !this.canEdit}, Validators.required],
      summary: [{value: data.summary, disabled: !this.canEdit}, Validators.required],
      problem: [{value: data.problem, disabled: !this.canEdit}, Validators.required],
      solution: [{value: data.solution, disabled: !this.canEdit}, Validators.required],
      advantages: [{value: data.advantages, disabled: !this.canEdit}],
      lang: [{value: data.lang, disabled: !this.canEdit}, Validators.required],
      principal: [{value: data.principal, disabled: !this.canEdit}, Validators.required],
      // media: [{value: data.media, disabled: !this.canEdit}, Validators.required] // On ne les gère plus dans le reactive form
    });
  }

  public createInnovationCard(event: Event, lang: string): void {
    event.preventDefault();

    if (this.canEdit) {
      if (this.project.innovationCards.length < 2 && this.project.innovationCards.length !== 0) {
        this._innovationService.createInnovationCard(this.project._id, {
          lang
        }).first()
          .subscribe((data: InnovCard) => {
            this._addInnovationCardWithData(data);
            this.project.innovationCards.push(data);
            this.updateCards();
          });
      }
      // window.location.reload();
    }

  }

  /*
  public createInnovationCard(event: Event): void {
    event.preventDefault();

    if (this.canEdit) {
      if (this.project.innovationCards.length < 2 && this.project.innovationCards.length !== 0) {
        this._innovationService.createInnovationCard(this.project._id, {
          lang: this.project.innovationCards[0].lang === 'en' ? 'fr' : 'en' // Pour l'instant il n'y a que deux langues
        }).first()
          .subscribe((data: InnovCard) => {
            this._addInnovationCardWithData(data);
            this.project.innovationCards.push(data);
            this.updateCards();
          });
      }
      // window.location.reload();
    }

  }
   */


  private _addInnovationCardWithData(innovationCardData: InnovCard): void {
    const innovationCards = this.innovationData.controls['innovationCards'] as FormArray;
    innovationCards.push(this._newInnovationCardFormBuilderGroup(innovationCardData));
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
  }

  public setAsPrincipal (innovationCardId: string): void {
    const innovationCards = this.innovationData.get('innovationCards').value;

    for (const innovationCard of innovationCards) {
      innovationCard.principal = innovationCard.id === innovationCardId;
    }

    this.innovationData.get('innovationCards').setValue(innovationCards);
    this.updateCards();

  }

  public imageUploaded(media: Media): void {
    this.project.innovationCards[this.innovationCardEditingIndex].media.push(media);
    this.projectChange.emit(this.project);
  }

  public newOnlineVideoToAdd (videoInfos: Video): void {
    this._innovationService.addNewMediaVideoToInnovationCard(this.project._id, this.project.innovationCards[this.innovationCardEditingIndex]._id, videoInfos)
      .first()
      .subscribe(res => {
        this.project = res;
        this.projectChange.emit(this.project);
      });
  }

  public setMediaAsPrimary (event: Event, media: Media): void {
    event.preventDefault();
    this._innovationService.setPrincipalMediaOfInnovationCard(this.project._id, this.project.innovationCards[this.innovationCardEditingIndex]._id, media._id)
      .first()
      .subscribe((res: Innovation) => {
        this.project = res;
        this.projectChange.emit(this.project);
      });
  }

  public deleteMedia(event: Event, media: Media): void {
    event.preventDefault();
    this._innovationService.deleteMediaOfInnovationCard(this.project._id, this.project.innovationCards[this.innovationCardEditingIndex]._id, media._id)
      .first()
      .subscribe((res: Innovation) => {
        this.project = res;
        this.projectChange.emit(this.project);
      });
  }

  public deleteInnovCard(innovId: string) {

    let confirmMessage = '';

    if (this._translateService.currentLang === 'fr') {
      confirmMessage = 'Êtes-vous vraiment sûr de vouloir supprimer votre projet dans cette langue ?'
    } else {
      confirmMessage = 'Are you really sure you want to delete your project in this language?'
    }

    if (confirm(confirmMessage)) {
      this._innovationService.removeInnovationCard(this.project._id, innovId).subscribe((res) => {
        window.location.reload();
      }, err => {
        this._translateNotificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
    }

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
