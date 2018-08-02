import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationSettings } from '../../../../../../models/innov-settings';
import { Subject } from 'rxjs/Subject';
import {Template} from '../../../../../sidebar/interfaces/template';

const DEFAULT_TAB = 'targeting';

@Component({
  selector: 'app-client-setup-project',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupProjectComponent implements OnInit {

  @Input() project: Innovation;

  private _changesSaved: boolean;
  private _saveChanges: boolean;
  private _saveButtonClass: string; // class to attach on the save button respect to the form status.

  pitchFormValid: boolean;
  showPitchFieldError: Subject<boolean> = new Subject();
  targetingFormValid: boolean;
  showTargetingFieldError: Subject<boolean> = new Subject();
  scrollOn = false;

  innovationPreviewIndex = 0;
  sidebarTemplateValue: Template = {};

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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY !== 0) {
      this.scrollOn = true;
    } else {
      this.scrollOn = false;
    }
  }

  /*
      Here we are checking the fields that are required to submit or validate the form.
   */
  checkProjectStatus() {
    for (let i = 0; i < this.project.innovationCards.length; i++ ) {
      if (this.project.innovationCards[i].title === '' || this.project.innovationCards[i].summary === ''
        || this.project.innovationCards[i].problem === '' || this.project.innovationCards[i].solution === ''
        || this.project.innovationCards[i].advantages.length === 0 || this.project.external_diffusion === null
        || this.project.patented === null) {
        this.pitchFormValid = false;
        break;
      } else {
        this.pitchFormValid = true;
      }
    }

    if (this.project.settings.market.comments.length !== 0 && (this.project.settings.geography.exclude.length !== 0
      || this.project.settings.geography.comments.length !== 0 || this.project.settings.geography.continentTarget.russia
      || this.project.settings.geography.continentTarget.oceania || this.project.settings.geography.continentTarget.europe
      || this.project.settings.geography.continentTarget.asia || this.project.settings.geography.continentTarget.americaSud
      || this.project.settings.geography.continentTarget.americaNord || this.project.settings.geography.continentTarget.africa) ) {
      this.targetingFormValid = true;
    } else {
      this.targetingFormValid = false;
    }

  }

  saveProject(event: Event): void {
    event.preventDefault();

     if (this._saveChanges) {
        this.innovationService.save(this.project._id, this.project).first().subscribe(data => {
            this.project = data;
            this.notificationService.success('ERROR.PROJECT.SAVED', 'ERROR.PROJECT.SAVED_TEXT');
            this._changesSaved = true;
            this._saveChanges = false;
            this._saveButtonClass = 'disabled';
            this.checkProjectStatus();
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
      .first().subscribe(data => {
       this.project.status = 'SUBMITTED';
       this.notificationService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
       this.router.navigate(['project']);
      }, err => {
        this.notificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });

  }

  /*
      Here we are receiving the value from the targeting form.
   */
  updateSettings(value: InnovationSettings): void {
    if (this.projectStatus === 'EDITING' || this.projectStatus === 'SUBMITTED') {
      this.project.settings = value;
      this._saveChanges = true;
      this._saveButtonClass = 'save-project';
    } else {
      this._saveButtonClass = 'disabled';
    }
  }

  /*
     Here we are checking if there are any changes in the pitch form
     shows the notification to the client.
  */
  saveInnovation(value: boolean) {
    if (this.projectStatus === 'EDITING' || this.projectStatus === 'SUBMITTED') {
      this.checkProjectStatus();
      this._saveChanges = value;
      this._changesSaved = false;
      this._saveButtonClass = 'save-project';
    } else {
      this._saveButtonClass = 'disabled';
    }
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._projectToBeSubmitted = false;
  }

  innovationIndex(value: number) {
    this.innovationPreviewIndex = value;
  }

  showInnovation(event: Event) {
    event.preventDefault();
    this.sidebarTemplateValue = {
      animate_state: this.sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'PROJECT_MODULE.SETUP.PREVIEW',
      size: '726px'
    };
  }

  public printInnovationCard(event: Event) {
    event.preventDefault();
    window.print();
  }

  closeSidebar(value: string) {
    this.sidebarTemplateValue.animate_state = value;
  }

  get currentTab() {
    return this._currentTab;
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

  get projectStatus(): string {
    return this.project.status;
  }

}
