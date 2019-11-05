import { Component, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Innovation } from '../../../../../../../../../models/innovation';
import { environment } from '../../../../../../../../../../environments/environment';
import { generationTemplate } from '../../../../../../../../../models/static-data/templates/questionnaire-generation';
import { validationTemplate } from '../../../../../../../../../models/static-data/templates/questionnaire-validation';
import { rechercheTemplate } from '../../../../../../../../../models/static-data/templates/questionnaire-recherche';
import { InnovationFrontService } from '../../../../../../../../../services/innovation/innovation-front.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PresetRequirement } from '../../../../../../../../../models/preset';
import { TranslateNotificationsService } from '../../../../../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})

export class SurveyComponent implements OnDestroy {

  @Input() set innovation(value: Innovation) {
    if (value) {
      this._innovation = value;
      this._quizUrl();
      this._presetLangs();
      this._checkRequirements();
      this._selectedIndex = this._setSelectedIndex();
    }
  }

  private _innovation: Innovation;

  private _url = '';

  private _saveChanges: boolean = false;

  private _ngUnsubscribe: Subject<boolean> = new Subject();

  private _showModel: boolean = false;

  private _showModelTemplate: boolean = false;

  private _templateToPreview: string = '';

  private _selectedIndex: number;

  private _isShowableButton: boolean = true;

  private _templateLangs: Array<string> = [];

  private _selectedLang: string;

  constructor(private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) {

    this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._saveChanges = response;
    });

  }

  private _quizUrl() {
    if (this._innovation.quizId) {
      this._url = environment.quizUrl + '/quiz/' + this._innovation.quizId + '/preview?lang=' + this.userLang;
    }
  }

  private _presetLangs() {
    this._templateLangs = this._innovation.innovationCards.map((card) => {
      return card.lang;
    });
  }

  private _checkRequirements() {
    this._innovation.preset.requirements = [];
    /*this._innovation.preset.requirements = this._innovation.preset.requirements.filter((value: PresetRequirement) => {
      return this._templateLangs.findIndex((lang) => lang === value.lang) !== -1;
    });*/
  }

  private _setSelectedIndex(): number {

    if (this.hasRequirement) {
      this._templateLangs.forEach((value, index) => {
        if (this._innovation.preset.requirements.find((value2: PresetRequirement) => value2.lang === value)) {
          this._selectedLang = value;
          return index;
        }
      });
    }

    this._selectedLang = this._templateLangs[0];
    return 0;

  }

  public onClickPreview(event: Event, template: string) {
    event.preventDefault();
    this._templateToPreview = template;
    this._showModel = true;
  }

  public onClickSelect(event: Event, template: string) {
    if (this.isEditable) {
      event.preventDefault();
      this._innovation.preset.template = template;
      this._verifyNoTemplate();
    }
  }

  /***
   * this function is to check if the user is currently working
   * on the template and by mistake he clicks on the
   * select. We need to notify him.
   * @private
   */
  private _verifyNoTemplate() {
    if (this.hasRequirement) {
      this._showModelTemplate = true;
    } else {
      this._initializeTemplate();
      this._isShowableButton = false;
      this._notifyChanges();
    }
  }

  public onClickConfirm(event: Event) {
    event.preventDefault();
    this._initializeTemplate();
    this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PRESET.LOADED');
    this._notifyChanges();
    this._showModelTemplate = false;
  }

  private _initializeTemplate() {
    this._templateLangs.forEach((lang, index) => {
      switch (this._innovation.preset.template) {

        case 'leadGeneration':
          this._innovation.preset.requirements[index] = this._loadData(generationTemplate, lang);
          break;

        case 'potentialValidation':
          this._innovation.preset.requirements[index] = this._loadData(validationTemplate, lang);
          break;

        case 'marketResearch':
          this._innovation.preset.requirements[index] = this._loadData(rechercheTemplate, lang);
          break;

      }
    });
  }

  private _loadData(template: Array<PresetRequirement>, lang: string): PresetRequirement {
    const index = template.findIndex((value) => value.lang === lang);
    return template[index];
  }

  public getHeading(): string {
    switch (this._innovation.preset.template) {

      case 'leadGeneration':
        return this._selectedLang === 'en' ? 'Lead generation' : 'Génération de leads';

      case 'potentialValidation':
        return this._selectedLang === 'en' ? 'Validation of the potential of innovation' : 'Validation du potentiel de l’innovation';

      case 'marketResearch':
        return this._selectedLang === 'en' ? 'Application/Market Research' : 'Recherche d’applications/Marché';

    }
  }

  public onChangeLang(index: number, lang: string) {
    this._selectedIndex = index;
    this._selectedLang = lang;

    if (!this._innovation.preset.requirements.find((value: PresetRequirement) => value.lang === lang)) {
      this._innovation.preset.requirements[index] = {
        lang: lang,
        text: ''
      };

      this._notifyChanges();
    }

  }

  public updateData(event: { content: string }) {

    this._innovation.preset.requirements[this._selectedIndex] = {
      lang: this._selectedLang,
      text: event.content,
    };

    this._notifyChanges();

  }

  public loadExistTemplate() {
    this._isShowableButton = false;
  }

  private _notifyChanges() {
    if (this.isEditable) {
      this._innovationFrontService.setNotifyChanges(true);
    }
  }

  get isEditable(): boolean {
    return this._innovation && this._innovation.status
      && (this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED')
      && (this._innovation.preset && this._innovation.preset.accessibility.editable);
  }

  get isHidden(): boolean {
    return false;
    //return this._innovation.preset && this._innovation.preset.accessibility.hidden;
  }

  get hasRequirement(): boolean {
    return this._innovation && this._innovation.preset
      && this._innovation.preset.requirements
      && this._innovation.preset.requirements.length > 0;
  }

  get isExecutable(): boolean {
    return environment.production;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get url(): string {
    return this._url;
  }

  get userLang(): string {
    return this._translateService.currentLang;
  }

  get saveChanges(): boolean {
    return this._saveChanges;
  }

  get showModel(): boolean {
    return this._showModel;
  }

  set showModel(value: boolean) {
    this._showModel = value;
  }

  get showModelTemplate(): boolean {
    return this._showModelTemplate;
  }

  set showModelTemplate(value: boolean) {
    this._showModelTemplate = value;
  }

  get templateToPreview(): string {
    return this._templateToPreview;
  }

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  get isShowableButton(): boolean {
    return this._isShowableButton;
  }

  get templateLangs(): Array<string> {
    return this._templateLangs;
  }

  get selectedLang(): string {
    return this._selectedLang;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
