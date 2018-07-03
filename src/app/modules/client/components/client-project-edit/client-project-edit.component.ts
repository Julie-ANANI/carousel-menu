import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { ComponentCanDeactivate } from '../../../../pending-changes-guard.service';
import { Observable } from 'rxjs/Observable';
import { PageScrollConfig } from 'ng2-page-scroll';
import { Innovation } from '../../../../models/innovation';
import { InnovationSettings } from '../../../../models/innov-settings';
import { User } from '../../../../models/user.model';
import { Subject } from 'rxjs/Subject';
import { emailRegEx } from '../../../../utils/regex';
import { environment } from '../../../../../environments/environment';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-client-project-edit',
  templateUrl: './client-project-edit.component.html',
  styleUrls: ['./client-project-edit.component.scss']
})
export class ClientProjectEditComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  private _project: Innovation;
  public formData: FormGroup;
  private ngUnsubscribe: Subject<any> = new Subject();

  private _companyName: string = environment.companyShortName;

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

  /*
   * Gestion de l'affichage
   */
  public innovationCardEditingIndex = 0; // Index de l'innovationCard que l'on édite (système d'onglets)

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

    this.formData.valueChanges
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(_ => {
        this.shouldSave = true;
      });
    PageScrollConfig.defaultDuration = 500;
  }

  public updateCards(event: any) {
    this.shouldSave = true;
    this._project.innovationCards = event.innovationCards;
    this.formData.get('patented').setValue(event.patented);
    this.formData.get('projectStatus').setValue(event.projectStatus);
  }

  public updateProject(event: Innovation) {
    this._project = event;
  }

  public updateSettings(event: InnovationSettings): void {
    this.formData.get('settings').setValue(event);
  }

  private _buildForm(): void {
    this.formData = this._formBuilder.group({
      settings: [undefined, Validators.required],
      type: ['insights', Validators.required],
      patented: [undefined, Validators.required],
      projectStatus: [undefined, Validators.required],
      external_diffusion: [false, [Validators.required]]
    });
  }

  /**
   * Sauvegarde
   * @param callback
   */
  public save(callback: () => void): void {
    if (this.canEdit) {
      this.formData.value.innovationCards = this._project.innovationCards;
      this._innovationService
        .save(this._project._id, this.formData.value)
        .first()
        .subscribe((data: Innovation) => {
        this.lastSavedDate = new Date(data.updated);
        this.shouldSave = false;
        if (callback) {
          callback();
        }
      }, err => {
        this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
    } else {
      this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', 'ERROR.CANT_EDIT');
    }
  }

  public submitProjectToValidation(event: Event): void {
    event.preventDefault();
    this.save(() => {
      this._innovationService.submitProjectToValidation(this._project._id).first().subscribe(_ => {
        this._router.navigate(['../']);
        this._notificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
      });
    });
  }

  /**
   * Builds the data required to ask the API for a PDF
   * @returns {{projectId, innovationCardId}}
   */
  public dataBuilder(): any {
    return this._project.innovationCards[0] ? {
      projectId: this._project._id,
      innovationCardId: this._project.innovationCards[0]._id,
      title: this._project.innovationCards[0].title.slice(0, Math.min(20, this._project.innovationCards[0].title.length)) + '-project(' + (this.project.innovationCards[0].lang || 'en') + ').pdf'
    } : {
      projectId: this._project._id,
      innovationCardId: '',
      title: ''
    }
  }

  public getModel (): any {
    return {
      lang: 'en',
      jobType: 'innovation',
      labels: 'EXPORT.INNOVATION.CARD',
      pdfDataseedFunction: this.dataBuilder()
    };
  }


  public validateProject(event: Event): void {
    event.preventDefault();
    this._innovationService.validate(this._project._id).first().subscribe(_ => {
      this._notificationsService.success('Projet validé', 'Le projet a bien été validé');
      this._router.navigate(['/admin']);
    });
  }

  public askRevision(event: Event): void {
    event.preventDefault();
    this._innovationService.askRevision(this._project._id).first().subscribe(_ => {
      this._notificationsService.success('Projet en révision', 'Le projet a été passé en status de révision, veuillez avertir le propriétaire des chagements à effectuer');
      this._router.navigate(['/admin']);
    });
  }

  public validCollaboratorsList(): boolean {
    let validCount = 0;
    const split = this.collaborators_emails.split(/[\s,;:]/g).filter(val=>val !== '');
    split.forEach(mail=>{
      if(mail.match(emailRegEx)) {
        validCount++;
      }
    });
    return validCount > 0 && validCount === split.length;
  }

  public addCollaborators (event: Event): void {
    event.preventDefault();
    if (this.collaborators_emails !== '') {
      this._innovationService.inviteCollaborators(this._project._id, this.collaborators_emails).first().subscribe((data: any) => {
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

  public removeCollaborator (event: Event, collaborator: User): void {
    event.preventDefault();
    this._innovationService.removeCollaborator(this._project._id, collaborator).first().subscribe((collaborators: Array<User>) => {
      this.project.collaborators = collaborators;
    });
  }

  // Print Innovation Card
  public printInnovationCard(event: Event) {
    event.preventDefault();
    window.print();
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.shouldSave;
  }

  // @HostListener allows us to also guard against browser refresh, close, etc. (IE !?)
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (!this.canDeactivate()) {
      $event.returnValue = 'You have unsaved changes. Please save as draft before leaving this page.'; // TODO translate
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get domSanitizer() { return this._domSanitizer; }
  get canEdit (): boolean { return this._project && (this._project.status === 'EDITING') || this.isAdmin; }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get project(): Innovation { return this._project; }
  get isAdmin(): boolean { return (this._authService.adminLevel & 3) === 3; }

  get companyName(){
    return (this._companyName||'umi').toLocaleUpperCase();
  }

}
