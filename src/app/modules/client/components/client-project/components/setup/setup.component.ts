import { Component, Input, OnInit } from '@angular/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationSettings } from '../../../../../../models/innov-settings';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-client-setup-project',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupProjectComponent implements OnInit {

  @Input() project: Innovation;
  saveStatus: boolean;

  private _saveButtonClass: string; // class to attach on the save button respect to the form status.
  private _currentTab: string;

  constructor(private innovationService: InnovationService,
              private notificationService: TranslateNotificationsService,
              private _translateService: TranslateService) {
  }

  ngOnInit() {
    this._currentTab = 'pitch';
    this.saveStatus = true;
    this._saveButtonClass = 'disabled';
  }

  public updateSettings(value: InnovationSettings): void {
    this.project.settings = value;
  }

  public updateInnovation(value: Innovation): void {
    this.project = value;
  }

  public saveInnovation(value: boolean) {
    this.saveStatus = value;
    this._saveButtonClass = 'save-project';
  }

  public saveProject(event: Event): void {
    event.preventDefault();

   if (this.saveStatus) {
      this.innovationService
        .save(this.project._id, this.project)
        .first()
        .subscribe(data => {
          this.project = data;
          this.notificationService.success('ERROR.PROJECT.SAVED', 'ERROR.PROJECT.SAVED_TEXT');
        }, err => {
          this.notificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
        });

      this.saveStatus = false;
      this._saveButtonClass = 'disabled';

    }

  }

  public submitProject(event: Event): void {
    event.preventDefault();

    const currentLang = this._translateService.currentLang;

    if (this.saveStatus) {
      if (currentLang === 'fr') {
        alert('Veuillez sauvegarder le projet avant de le soumettre.')
      } else {
        alert('Please save the project before submitting it.')
      }
    } else {
      let confirmMessage = '';

      if (currentLang === 'fr') {
        confirmMessage = 'Êtes-vous vraiment sûr de vouloir envoyer votre projet pour validation ?'
      } else {
        confirmMessage = 'Are you really sure you want to send your project for validation?'
      }

      if (confirm(confirmMessage)) {
        this.innovationService
          .submitProjectToValidation(this.project._id)
          .first()
          .subscribe(data => {
            this.project.status = 'SUBMITTED';
            this.notificationService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
          }, err => {
            this.notificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
          });
      }
    }

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

}
