import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {MissionQuestionService} from '../../../../../../../services/mission/mission-question.service';
import {MissionTemplate} from '../../../../../../../models/mission';
import {MissionService} from '../../../../../../../services/mission/mission.service';
import {ActivatedRoute} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {first} from 'rxjs/operators';
import {TranslateNotificationsService} from '../../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../../services/error/error-front.service';
import {RolesFrontService} from '../../../../../../../services/roles/roles-front.service';
import {MissionFrontService} from '../../../../../../../services/mission/mission-front.service';
import {TranslateService} from '@ngx-translate/core';

interface ConfirmUpdate {
  tool: boolean;
  template: boolean;
}

@Component({
  selector: 'app-admin-edit-use-case',
  templateUrl: './admin-edit-use-case.component.html',
  styleUrls: ['./admin-edit-use-case.component.scss']
})
export class AdminEditUseCaseComponent implements OnInit {

  get validate(): ConfirmUpdate {
    return this._validate;
  }

  set validate(value: ConfirmUpdate) {
    this._validate = value;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  get questionnaireLanguages(): Array<string> {
    return this._questionnaireLanguages;
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  get missionTemplate(): MissionTemplate {
    return this._missionTemplate;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  private _fetchingError = false;

  private _missionTemplate = <MissionTemplate>{};

  private _isSaving = false;

  private _toBeSaved = false;

  private _questionnaireLanguages: Array<string> = ['en', 'fr'];

  private _accessPath: Array<string> = ['libraries', 'useCases'];

  private _validate: ConfirmUpdate = <ConfirmUpdate>{};

  private _showModal = false;

  private _valuesToSave: any = {};

  private _toSaveQuestion = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _missionService: MissionService,
              private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _missionQuestionService: MissionQuestionService) { }

  ngOnInit() {
    this._missionTemplate = this._missionQuestionService.template;
    this._initStack();

    this._activatedRoute.params.subscribe((params) => {
      const id = params['templateId'] || '';
      if (!!id && (id !== this._missionTemplate._id) || !this._missionTemplate._id ) {
        this._getTemplate(id);
      }
    });
  }

  private _initStack() {
    this._valuesToSave = {
      'question': {}
    };
  }

  private _getTemplate(id: string) {
    if (isPlatformBrowser(this._platformId)) {
      this._missionService.getTemplate(id).pipe(first()).subscribe((response) => {
        this._missionTemplate = response;
      }, error => {
        this._fetchingError = true;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
        console.error(error);
      });
    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(this._accessPath.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
    }
  }

  public onChangeObjective(event: string, index: number) {
    if (this.canAccess(['edit', 'objective'])) {
      this._missionTemplate.entry[index].objective = event.trim();
      this._toBeSaved = true;
    }
  }

  public onChangeTemplate(event: MissionTemplate) {
    if (this.canAccess(['section', 'edit'])) {
      this._missionTemplate = event;
      this._toBeSaved = true;
    }
  }

  public closeModal() {
    this._showModal = false;
    this._validate = <ConfirmUpdate>{};
  }

  public onClickValidate(event: Event) {
    event.preventDefault();
    if (this._validate.tool && this._validate.template) {
      this._isSaving = true;
      if (this._toSaveQuestion) {

      } else {
        this._useCaseUpdate();
      }
    }
  }

  private _useCaseUpdate() {
    this._missionService.saveTemplate(this._missionTemplate._id, this._missionTemplate)
      .pipe(first())
      .subscribe((_) => {
        this.closeModal();
        this._translateNotificationsService.success('Success', 'The use case has been updated successfully.');
        this._isSaving = false;
        this._toBeSaved = false;
      }, error => {
        this._isSaving = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
        console.error(error);
      });
  }

  public templateName() {
    return MissionFrontService.objectiveName(this._missionTemplate, this.currentLang);
  }

  public onClickSave(event: Event) {
    event.preventDefault();
    if ((this.canAccess(['section', 'edit']) || this.canAccess(['question', 'edit'])) && this._toBeSaved && !this._isSaving) {
      this._showModal = true;
      this._validate = <ConfirmUpdate>{};
    }
  }

  public changeStack(event: {key: string, value: any}) {
    console.log(event);
    if (!!event && this.canAccess(['question', 'edit'])) {

      switch (event.key) {

      }

      this._toBeSaved = true;
    }
    console.log(this._valuesToSave);
  }

}
