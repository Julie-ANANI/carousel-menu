import { Component, Input, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationSettings } from '../../../../../../models/innov-settings';

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
  formValid: boolean;
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
    this.formValid = false;
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
          }, err => {
            this.notificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
          });
     }

  }

  submitButton(event: Event): void {
    event.preventDefault();

    if (this._saveChanges) {
      this.notificationService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');

    } else {
      this._projectToBeSubmitted = true; // open the modal to ask the confirmation.
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

  // getting the save value from the child component.
  saveInnovation(value: boolean) {
    this._saveChanges = value;
    this._changesSaved = false;
    this._saveButtonClass = 'save-project';
  }

  settingTab(event: Event, value: string) {
    event.preventDefault();

    if (this._saveChanges) {
      this.notificationService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    } else {
      this._currentTab = value;
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

}
