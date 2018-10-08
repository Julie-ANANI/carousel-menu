import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { ComponentCanDeactivate } from '../../../../../../guards/pending-changes-guard.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationSettings } from '../../../../../../models/innov-settings';
import { Template } from '../../../../../sidebar/interfaces/template';
import { FrontendService } from '../../../../../../services/frontend/frontend.service';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

const DEFAULT_TAB = 'targeting';

@Component({
  selector: 'app-client-setup-project',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupProjectComponent implements OnInit, ComponentCanDeactivate {

  @Input() project: Innovation;

  private _changesSaved: boolean;
  private _saveChanges: boolean;
  private _saveButtonClass: string; // class to attach on the save button respect to the form status.

  private _pitchFormValid: boolean;
  private _showPitchFieldError: Subject<boolean> = new Subject();

  private _targetingFormValid: boolean;
  private _showTargetingFieldError: Subject<boolean> = new Subject();

  scrollOn = false;

  private _innovationPreviewIndex = 0;
  private _sidebarTemplateValue: Template = {};

  private _currentTab: string;
  private _projectToBeSubmitted: boolean;

  constructor(private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService,
              private router: Router,
              private frontendService: FrontendService) {}

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
    const scrollValue = window.pageYOffset || window.scrollY || 0;

    if (scrollValue > 0) {
      this.scrollOn = true;
    } else {
      this.scrollOn = false;
    }

  }

  canDeactivate(): boolean {
    return true;
  }

  /*
      Here we are checking the fields that are required to submit or validate the form.
   */
  private checkProjectStatus() {

    for (let i = 0; i < this.project.innovationCards.length; i++ ) {
      if (this.project.innovationCards[i].title === '' || this.project.innovationCards[i].summary === ''
        || this.project.innovationCards[i].problem === '' || this.project.innovationCards[i].solution === ''
        || this.project.innovationCards[i].advantages.length === 0 || this.project.external_diffusion === null
        || this.project.patented === null) {
        this._pitchFormValid = false;
        break;
      } else {
        this._pitchFormValid = true;
      }
    }

    if (this.project.settings.market.comments.length !== 0 && (this.project.settings.geography.exclude.length !== 0
      || this.project.settings.geography.comments.length !== 0 || this.project.settings.geography.continentTarget.russia
      || this.project.settings.geography.continentTarget.oceania || this.project.settings.geography.continentTarget.europe
      || this.project.settings.geography.continentTarget.asia || this.project.settings.geography.continentTarget.americaSud
      || this.project.settings.geography.continentTarget.americaNord || this.project.settings.geography.continentTarget.africa) ) {
      this._targetingFormValid = true;
    } else {
      this._targetingFormValid = false;
    }

  }

  saveProject(event: Event): void {
    event.preventDefault();

    this.frontendService.completionCalculation(this.project);

    const percentages = this.frontendService.calculatedPercentages;

    if (percentages) {
      this.project.settings.completion = percentages.settingPercentage;
      this.project.completion = percentages.totalPercentage;
      percentages.innovationCardsPercentage.forEach((item: any) => {
        const index = this.project.innovationCards.findIndex(card => card.lang === item.lang);
        this.project.innovationCards[index].completion = item.percentage;
      });
    }

     if (this._saveChanges) {
        this.innovationService.save(this.project._id, this.project).pipe(first()).subscribe((data: any) => {
            this.project = data;
            this._changesSaved = true;
            this._saveChanges = false;
            this._saveButtonClass = 'disabled';
            this.checkProjectStatus();
            this.translateNotificationsService.success('ERROR.PROJECT.SAVED', 'ERROR.PROJECT.SAVED_TEXT');
          }, (err: any) => {
            this.translateNotificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
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
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    } else {
      if (this._targetingFormValid) {
        if (this._pitchFormValid) {
          this._projectToBeSubmitted = true; // open the modal to ask the confirmation.
        } else {
          this._showPitchFieldError.next(true);
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FORM.PITCH_FORM');
        }
      } else {
        this._showTargetingFieldError.next(true);
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FORM.TARGETING_FORM');
      }
    }

  }

  submitProject(event: Event) {
    event.preventDefault();
    this._projectToBeSubmitted = false;

    this.innovationService.submitProjectToValidation(this.project._id)
      .pipe(first()).subscribe((data: any) => {
       this.project.status = 'SUBMITTED';
       this.translateNotificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
       this.router.navigate(['project']);
      }, (err: any) => {
        this.translateNotificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });

  }

  /*
      Here we are receiving the value from the targeting form.
   */
  updateSettings(value: InnovationSettings): void {
    if (this.projectStatus === 'EDITING' || this.projectStatus === 'SUBMITTED') {
      this.project.settings = value;
      // this.completionCalculation();
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
    this._innovationPreviewIndex = value;
  }

  showInnovation(event: Event) {
    event.preventDefault();
    this._sidebarTemplateValue = {
      animate_state: this._sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'PROJECT_MODULE.SETUP.PREVIEW',
      size: '726px'
    };
  }

  printInnovationCard(event: Event) {
    event.preventDefault();
    window.print();
  }

  closeSidebar(value: string) {
    this._sidebarTemplateValue.animate_state = value;
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

  get pitchFormValid(): boolean {
    return this._pitchFormValid;
  }

  get showPitchFieldError(): Subject<boolean> {
    return this._showPitchFieldError;
  }

  get targetingFormValid(): boolean {
    return this._targetingFormValid;
  }

  get showTargetingFieldError(): Subject<boolean> {
    return this._showTargetingFieldError;
  }

  set showTargetingFieldError(value: Subject<boolean>) {
    this._showTargetingFieldError = value;
  }

  get innovationPreviewIndex(): number {
    return this._innovationPreviewIndex;
  }

  get sidebarTemplateValue(): Template {
    return this._sidebarTemplateValue;
  }

  set sidebarTemplateValue(value: Template) {
    this._sidebarTemplateValue = value;
  }

}
