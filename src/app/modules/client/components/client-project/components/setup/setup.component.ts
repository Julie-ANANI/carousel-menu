import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationSettings } from '../../../../../../models/innov-settings';
import { Subject } from 'rxjs/Subject';

const DEFAULT_TAB = 'pitch';

@Component({
  selector: 'app-client-setup-project',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupProjectComponent implements OnInit {

  @Input() project: Innovation;
  @Input() projectStatus: string;

  private _changesSaved: boolean;
  private _saveChanges: boolean;

  private _saveButtonClass: string; // class to attach on the save button respect to the form status.

  pitchFormValid: boolean;
  showPitchFieldError: Subject<boolean> = new Subject();
  targetingFormValid: boolean;
  showTargetingFieldError: Subject<boolean> = new Subject();

  private _currentTab: string;
  private _projectToBeSubmitted: boolean;

  constructor(private innovationService: InnovationService,
              private notificationService: TranslateNotificationsService,
              private router: Router) {
  }

  ngOnInit() {
    const url = this.router.routerState.snapshot.url.split('/');
    this._currentTab = url ? url[4] || DEFAULT_TAB : DEFAULT_TAB;
    this._saveChanges = false;
    this._changesSaved = false;
    this._saveButtonClass = 'disabled';
    this.checkProjectStatus();
  }

  /*
      Here we are checking the fields that are required to submit the form.
   */
  checkProjectStatus() {
    this.project.innovationCards.forEach((field) => {
      this.pitchFormValid = field.title !== '' && field.summary !== '' && field.problem !== '' && field.solution !== '' &&
        field.advantages.length !== 0 && this.project.patented !== null && this.project.external_diffusion !== null;
    });

    this.targetingFormValid = this.project.settings.market.comments.length !== 0 && this.project.settings.geography.exclude.length !== 0 || this.project.settings.geography.comments.length !== 0 ||
      this.project.settings.geography.continentTarget.russia || this.project.settings.geography.continentTarget.oceania || this.project.settings.geography.continentTarget.europe
      || this.project.settings.geography.continentTarget.asia || this.project.settings.geography.continentTarget.americaSud || this.project.settings.geography.continentTarget.americaNord
      || this.project.settings.geography.continentTarget.africa;

  }

  updateSettings(value: InnovationSettings): void {
    this.project.settings = value;
    this._saveChanges = true;
    this._saveButtonClass = 'save-project';
  }

  updateInnovation(value: Innovation): void {
    this.project = value;
  }

  saveProject(event: Event): void {
    event.preventDefault();

     if (this._saveChanges) {
        this.innovationService.save(this.project._id, this.project).first()
          .subscribe(data => {
            this.project = data;
            this.notificationService.success('ERROR.PROJECT.SAVED', 'ERROR.PROJECT.SAVED_TEXT');
            this._changesSaved = true;
            this._saveChanges = false;
            this._saveButtonClass = 'disabled';
            // this.showPitchFieldError.next(true); // to show the error in pitch form.
            // this.showTargetingFieldError.next(true); // to show the error in targeting form.
          }, err => {
            this.notificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
          });
     }

  }

  /*
      This is to show the error and open the confirmation modal before submitting
      the project to the server.
   */
  submitButton(event: Event): void {
    event.preventDefault();

    if (this._saveChanges) {
      this.notificationService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    } else {
      if (this.pitchFormValid) {
        if (this.targetingFormValid) {
          this._projectToBeSubmitted = true; // open the modal to ask the confirmation.
        } else {
          this.showTargetingFieldError.next(true);
          this.notificationService.error('ERROR.ERROR', 'ERROR.FORM.TARGETING_FORM');
        }
      } else {
        this.showPitchFieldError.next(true);
        this.notificationService.error('ERROR.ERROR', 'ERROR.FORM.PITCH_FORM');
      }
    }

  }

  submitProject(event: Event) {
    event.preventDefault();
    this._projectToBeSubmitted = false;

    this.innovationService.submitProjectToValidation(this.project._id)
      .first()
      .subscribe(data => {
       this.projectStatus = this.project.status = 'SUBMITTED';
       this.notificationService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
       this.router.navigate(['projects']);
      }, err => {
        this.notificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });

  }

  /*
      Here we are getting the value from the child component
      to check that pitch required fields are filled or not.
   */
  pitchFormValidation(value: boolean) {
    this.pitchFormValid = value;
  }

  /*
     Here we are getting the value from the child component
     to check that targeting required fields are filled or not.
  */
  targetingFormValidation(value: boolean) {
    this.targetingFormValid = value;
  }

  /*
     Here we are checking if there are any changes in the pitch form
     shows the notification to the client.
  */
  saveInnovation(value: boolean) {
    if (this.projectState !== 'EVALUATING') {
      this._saveChanges = value;
      this._changesSaved = false;
      this._saveButtonClass = 'save-project';
    }
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._projectToBeSubmitted = false;
  }

  get currentTab() {
    return this._currentTab;
  }

  set currentTab(value: string) {
    this._currentTab = value;
  }

  get saveButtonClass(): string {
    return this._saveButtonClass;
  }

  get saveChanges(): boolean {
    return this._saveChanges;
  }

  get projectToBeSubmitted(): boolean {
    return this._projectToBeSubmitted;
  }

  get changesSaved(): boolean {
    return this._changesSaved;
  }

  get projectState(): string {
    return this.project.status;
  }

}
