import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {ComponentCanDeactivate} from '../../../../pending-changes-guard.service';
import {Observable} from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-client-project-edit',
  templateUrl: './client-project-edit.component.html',
  styleUrls: ['./client-project-edit.component.scss']
})
export class ClientProjectEditComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  private _project: any;
  public formData: FormGroup;

  /*
   * Ajout de collaborateurs
   */
  public displayAddCollaboratorsModal = false;
  public displayCollaboratorsAddingProcess = false;
  public collaborators_emails = '';
  public collaboratorsAddingProcess: any = {
    usersAdded: [],
    invitationsToSend: [],
    invitationsToSendAgain: []
  };

  private _subscriptions: Array<ISubscription> = [];

  /*
   * Gestion de l'affichage
   */
  public innovationCardEditingIndex = 0; // Index de l'innovationCard que l'on édite (système d'onglets)
  public displayCountriesToExcludeSection = false;
  public displayCompanyToExcludeSection = false;
  public displayPersonsToExcludeSection = false;

  /*
   * Gestion de la sauvegarde
   */
  public shouldSave = false; // To prevent leaving page
  public lastSavedDate: Date;


  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _authService: AuthService,
              private _domSanitizer: DomSanitizer,
              private _translateService: TranslateService,
              private _router: Router,
              private _notificationsService: TranslateNotificationsService,
              private _formBuilder: FormBuilder) {}

  ngOnInit() {

    this._buildForm();
    this._project = this._activatedRoute.snapshot.data['innovation'];

    this.formData.patchValue(this._project);

    if (!this.canEdit) {
      this.formData.disable();
    }
    for (const innovationCard of this._project.innovationCards) {
      this._addInnovationCardWithData(innovationCard);

    }

    const formSubs = this.formData.valueChanges
      .distinctUntilChanged()
      .subscribe(newVersion => {
        this.shouldSave = true;
      });
    this._subscriptions.push(formSubs);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subs=>{
      subs.unsubscribe();
    });
  }

  public updateSettings(event) {
    this.formData.get('settings').setValue(event);
  }
  
  private _buildForm(): void {
    this.formData = this._formBuilder.group({
      settings: [undefined, Validators.required],
      type: ['insights', Validators.required],
      patented: [undefined, Validators.required],
      projectStatus: [undefined, Validators.required],
      innovationCards: this._formBuilder.array([]),
      external_diffusion: [false, [Validators.required]]
    });
  }

  /**
   * Sauvegarde
   * @param callback
   */
  public save(callback) {
    if (this.canEdit) {
      const saveSubs = this._innovationService
        .save(this._project.id, this.formData.value)
        .subscribe(data => {
        this.lastSavedDate = new Date(data.updated);
        this._project = data;
        this.shouldSave = false;
        if (callback) {
          callback();
        }
      }, err => {
        this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
      this._subscriptions.push(saveSubs);
    } else {
      this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', 'ERROR.CANT_EDIT');
    }
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
        placeholder: 'PROJECT_EDIT.DESCRIPTION.ADVANTAGES.INPUT',
        initialData: this.formData.get('innovationCards').value[this.innovationCardEditingIndex]['advantages']
      }
    };
    return _inputConfig[type] || {
      placeholder: 'Input',
      initialData: ''
    };
  }

  private _newInnovationCardFormBuilderGroup (data) {
    return this._formBuilder.group({
      id: [{value: data.id, disabled: !this.canEdit}, Validators.required],
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

  public createInnovationCard() {
    if (this.canEdit) {
      if (this._project.innovationCards.length < 2 && this._project.innovationCards.length !== 0) {
        const innoCardSubs = this._innovationService.createInnovationCard(this._project.id, {
          lang: this._project.innovationCards[0].lang === 'en' ? 'fr' : 'en' // Pour l'instant il n'y a que deux langues
        }).subscribe((data) => {
          this._addInnovationCardWithData(data);
          this._project.innovationCards.push(data);
        });
        this._subscriptions.push(innoCardSubs);
      }
    }
  }

  private _addInnovationCardWithData(innovationCardData): void {
    const innovationCards = this.formData.controls['innovationCards'] as FormArray;
    innovationCards.push(this._newInnovationCardFormBuilderGroup(innovationCardData));
  }

  /**
   * Add an advantage to the invention card
   * @param event the resulting value sent from the component directive
   * @param cardIdx this is the index of the innovation card being edited.
   */
  public addAdvantageToInventionCard (event, cardIdx) {
    const card = this.formData.get('innovationCards').value[cardIdx] as FormGroup;
    card['advantages'] = event.value;
  }

  public setAsPrincipal (innovationCardId) {
    const innovationCards = this.formData.get('innovationCards').value;
    for (const innovationCard of innovationCards) {
      innovationCard.principal = innovationCard.id === innovationCardId;
    }
    this.formData.get('innovationCards').setValue(innovationCards);
  }

  public submitProjectToValidation () {
    this.save(_ => {
      const saveSubs = this._innovationService.submitProjectToValidation(this._project.id).subscribe(data2 => {
        this._router.navigate(['../']);
        this._notificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
      });
      this._subscriptions.push(saveSubs);
    });
  }


  public imageUploaded(media) {
    this._project.innovationCards[this.innovationCardEditingIndex].media.push(media);
    const mediaSubs = this._innovationService
      .addMediaToInnovationCard(this._project.id, this._project.innovationCards[this.innovationCardEditingIndex]._id, media._id)
      .subscribe(res => {
        this._project = res;
    });
    this._subscriptions.push(mediaSubs);
  }

  public newOnlineVideoToAdd (videoInfos) {
    this._innovationService.addNewMediaVideoToInnovationCard(this._project.id, this._project.innovationCards[this.innovationCardEditingIndex]._id, videoInfos).subscribe(res => {
      this._project = res;
    });
  }

  public setMediaAsPrimary (media) {
    const mediaSubs = this._innovationService.setPrincipalMediaOfInnovationCard(this._project.id, this._project.innovationCards[this.innovationCardEditingIndex]._id, media._id).subscribe(res => {
      this._project = res;
    });
    this._subscriptions.push(mediaSubs);
  }

  public deleteMedia (media) {
    const mediaSubs = this._innovationService.deleteMediaOfInnovationCard(this._project.id, this._project.innovationCards[this.innovationCardEditingIndex]._id, media._id).subscribe(res => {
      this._project = res;
    });
    this._subscriptions.push(mediaSubs);
  }

  /**
   * Builds the data required to ask the API for a PDF
   * @returns {{projectId, innovationCardId}}
   */
  public dataBuilder(): any {
    return {
      projectId: this._project.id,
      innovationCardId: this._project.innovationCards[0].id,
      title: this._project.innovationCards[0].title.slice(0, Math.min(20, this._project.innovationCards[0].title.length)) + "-" + "project" +"(" + (this.project.innovationCards[0].lang || 'en') +").pdf"
    }
  }

  public getModel (): any {
    return {
      lang: 'en',
      jobType: 'innovationCard',
      labels: 'EXPORT.INNOVATION.CARD',
      pdfDataseedFunction: this.dataBuilder()
    };
  }

  public validateProject () {
    this._innovationService.validate(this._project.id).subscribe(data => {
      this._notificationsService.success('Projet validé', 'Le projet a bien été validé');
      this._router.navigate(['/admin']);
    });
  }

  public askRevision () {
    this._innovationService.askRevision(this._project.id).subscribe(data => {
      this._notificationsService.success('Projet en révision', 'Le projet a été passé en status de révision, veuillez avertir le propriétaire des chagements à effectuer');
      this._router.navigate(['/admin']);
    });
  }

  public addCollaborators () {
    if (this.collaborators_emails !== '') {
      this._innovationService.inviteCollaborators(this._project.id, this.collaborators_emails).subscribe(data => {
        if (data.usersAdded.length || data.invitationsToSend.length || data.invitationsToSendAgain.length) {
          this.collaboratorsAddingProcess = data;
          this.collaboratorsAddingProcess.inviteUrl = this._innovationService.getInvitationUrl();
          this.displayCollaboratorsAddingProcess = true;

          if (data.usersAdded.length) {
            this._project.collaborators = this._project.collaborators.concat(data.usersAdded);
          }
        }
        this.collaborators_emails = '';
        this.displayAddCollaboratorsModal = false;
      });
    }
  }

  public removeCollaborator (collaborator: any) {
    this._innovationService.removeCollaborator(this._project.id, collaborator).subscribe(collaborators => {
      this.project.collaborators = collaborators;
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.shouldSave;
  }

  // @HostListener allows us to also guard against browser refresh, close, etc. (IE !?)
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = 'You have unsaved changes. Please save as draft before leaving this page.'; // TODO translate
    }
  }

  get domSanitizer() { return this._domSanitizer; }
  get canEdit () { return this._project && (this._project.status === 'EDITING' || this.isAdmin); }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get project(): any { return this._project; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

}
