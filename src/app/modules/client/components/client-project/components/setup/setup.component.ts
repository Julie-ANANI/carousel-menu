import { Component, Input, OnInit } from '@angular/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationSettings } from '../../../../../../models/innov-settings';

@Component({
  selector: 'app-client-setup-project',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupProjectComponent implements OnInit {

  @Input() project: Innovation;
  @Input() changesSaved: boolean;

  private _saveChanges: boolean;

  private _saveButtonClass: string; // class to attach on the save button respect to the form status.
  private _currentTab: string;
  projectToBeSubmitted: boolean;

  constructor(private innovationService: InnovationService,
              private notificationService: TranslateNotificationsService) {
  }

  ngOnInit() {
    this._currentTab = 'pitch';
    this._saveChanges = false;
    this._saveButtonClass = 'disabled';
  }

  public updateSettings(value: InnovationSettings): void {
    this.project.settings = value;
  }

  public updateInnovation(value: Innovation): void {
    this.project = value;
  }

  public saveProject(event: Event): void {
    event.preventDefault();

     if (this._saveChanges) {
        this.innovationService.save(this.project._id, this.project)
          .first()
          .subscribe(data => {
            this.project = data;
            this.notificationService.success('ERROR.PROJECT.SAVED', 'ERROR.PROJECT.SAVED_TEXT');
          }, err => {
            this.notificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
          });

        this.changesSaved = true;
        this._saveChanges = false;
        this._saveButtonClass = 'disabled';
     }

  }

  public submitButton(event: Event): void {
    event.preventDefault();

    if (this._saveChanges) {
      this.notificationService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    } else {
      this.projectToBeSubmitted = true; // open the modal to ask the confirmation.
    }

  }

  public submitProject(event: Event) {
    event.preventDefault();
    this.projectToBeSubmitted = false;

    this.innovationService.submitProjectToValidation(this.project._id)
      .first()
      .subscribe(data => {
        this.project.status = 'SUBMITTED';
        this.notificationService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
      }, err => {
        this.notificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });

  }

  // getting the save value from the child component.
  public saveInnovation(value: boolean) {
    this._saveChanges = value;
    this._saveButtonClass = 'save-project';
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


}
