import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Answer} from '../../../../../models/answer';
import {
  Innovation,
  InnovationFollowUpEmails,
  InnovationFollowUpEmailsCc,
  InnovationFollowUpEmailsTemplate
} from '../../../../../models/innovation';
import {MissionQuestion} from '../../../../../models/mission';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateNotificationsService} from '../../../../../services/translate-notifications/translate-notifications.service';
import {InnovationFrontService} from '../../../../../services/innovation/innovation-front.service';
import {InnovCard} from '../../../../../models/innov-card';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
import {first, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../services/error/error-front.service';
import {FilterService} from '../../shared-market-report/services/filters.service';
import {Subject} from 'rxjs';
import {emailRegEx} from '../../../../../utils/regex';
import {ScrapeHTMLTags} from '../../../../../pipe/pipes/ScrapeHTMLTags';
import {TranslateService} from '@ngx-translate/core';
import {UserFrontService} from '../../../../../services/user/user-front.service';
import {LangEntryService} from '../../../../../services/lang-entry/lang-entry.service';
import {Table, UmiusConfigInterface, UmiusSidebarInterface} from '@umius/umi-common-component';

@Component({
  selector: 'app-shared-follow-up-client',
  templateUrl: './shared-follow-up-client.component.html',
  styleUrls: ['./shared-follow-up-client.component.scss']
})
export class SharedFollowUpClientComponent implements OnDestroy {

  @Input() set startContactProcess(value: boolean) {
    if (!!value) {
      this._initVariables();
    }
    this._startContactProcess = value;
  }

  @Input() questions: Array<MissionQuestion> = [];

  @Input() set project(value: Innovation) {
    this._project = value;
    this._initVariables();
  }

  @Input() set answers (value: Array<Answer>) {
    this.initEmailObject();
    this._answers = value;
    this._initFilter();
    this._initTable(value, value.length);
  }

  @Output() reinitializeAnswers: EventEmitter<void> = new EventEmitter<void>();

  @Output() startContactProcessChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _answers: Array<Answer> = [];

  private _selectedIds: Array<string> = [];

  private _companyName = '';

  private _cc: Array<InnovationFollowUpEmailsCc> = [];

  private _contactFields: Array<string> = ['STEP_INTRO', 'STEP_SELECT', 'STEP_CONFIGURE', 'STEP_SEND'];

  private _currentStep = 0;

  private _introImages: Array<string> = [
    'https://res.cloudinary.com/umi/image/upload/v1633357892/app/default-images/follow-up/01select.svg',
    'https://res.cloudinary.com/umi/image/upload/v1633357893/app/default-images/follow-up/02configure.svg',
    'https://res.cloudinary.com/umi/image/upload/v1633357896/app/default-images/follow-up/03send.svg'
  ];

  private _isNextStep = false;

  private _nextStepTimeout: any = null;

  private _phraseChoose: Array<string> = ['DISCUSSION', 'INFORM'];

  private _selectedPhrase = 'DISCUSSION';

  private _modalAnswer: Answer = null;

  private _sidebarAnswer: UmiusSidebarInterface = <UmiusSidebarInterface>{};

  private _sidebarTemplate: UmiusSidebarInterface = {
    animate_state: 'inactive',
    type: 'FOLLOW_UP'
  };

  private _steps: Array<string> = ['COMMON.LABEL.SELECTED', 'COMMON.LABEL.CONFIGURE', 'COMMON.LABEL.SEND'];

  // private _emailsObject: EmailsObject = <EmailsObject>{};
  private _emailsObject: InnovationFollowUpEmailsTemplate = <InnovationFollowUpEmailsTemplate>{};

  // private _emailsObjectReplaced: EmailsObject = <EmailsObject>{};
  private _emailsObjectReplaced: InnovationFollowUpEmailsTemplate = <InnovationFollowUpEmailsTemplate>{};

  private _showModal = false;

  private _sendShowModal = false;

  private _formData: FormGroup = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(emailRegEx), Validators.email]]
  });

  private _selectedCC: Array<InnovationFollowUpEmailsCc> = [];

  private _ccToAdd: InnovationFollowUpEmailsCc = <InnovationFollowUpEmailsCc>{};

  private _langs: Array<string> = [];

  private _selectedLang = '';

  private _finalTableInfos: Table = <Table>{};

  private _finalConfig: UmiusConfigInterface = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": "-1" }'
  };

  private _planeImage = 'https://res.cloudinary.com/umi/image/upload/app/default-images/follow-up/03send.svg';

  private _isSending = false;

  private _startContactProcess = false;

  private _project: Innovation = <Innovation>{};

  private _tableInfos: Table = <Table>{};

  private _config: UmiusConfigInterface = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": "-1" }'
  };

  private _finalAnswers: Array<Answer> = [];

  private _subscribe: Subject<any> = new Subject<any>();

  private static _isRowDisabled(answer: Answer): boolean {
    return !!(answer.followUp && answer.followUp.date);
  }

  constructor(private _formBuilder: FormBuilder,
              private _innovationService: InnovationService,
              private _filterService: FilterService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  private _initFilter() {
    if (this._answers.length) {
      this._filterService.filtersUpdate.pipe(takeUntil(this._subscribe)).subscribe(() => {
        const _filtered = this._filterService.filter(this._answers)
          .filter((_answer) => !SharedFollowUpClientComponent._isRowDisabled(_answer));
        this._initTable(_filtered, _filtered.length);
        if (_filtered.length) {
          this._selectedIds = [];
        }
      });
    }
  }

  private _initTable(answers: Array<Answer> = [], total = 0) {
    this._tableInfos = {
      _selector: 'project-follow-up',
      _content: answers,
      _total: total,
      _clickIndex: 1,
      _isSelectable: this._startContactProcess,
      _isPaginable: true,
      _paginationTemplate: 'TEMPLATE_1',
      _isLocal: true,
      _isNoMinHeight: answers.length < 11,
      _isRowDisabled: (answer: Answer) => SharedFollowUpClientComponent._isRowDisabled(answer),
      _columns: [
        {
          _attrs: ['professional.lastName'],
          _name: 'COMMON.LABEL.LASTNAME',
          _type: 'TEXT'
        },
        {
          _attrs: ['professional.firstName'],
          _name: 'COMMON.LABEL.FIRSTNAME',
          _type: 'TEXT'
        },
        {
          _attrs: ['professional.jobTitle'],
          _name: 'COMMON.LABEL.JOBTITLE',
          _type: 'TEXT'
        },
        {
          _attrs: ['professional.company.name'],
          _name: 'COMMON.LABEL.COMPANY',
          _type: 'TEXT'
        },
        {
          _attrs: ['country'],
          _name: 'COMMON.LABEL.COUNTRY',
          _type: 'COUNTRY',
          _width: '100px'
        },
        {
          _attrs: ['followUp.date'],
          _name: 'COMMON.LABEL.SEND',
          _type: 'DATE',
        },
      ]
    };
  }

  public updateEntity() {
    this._saveProject({followUpEmails: this._followUpObj('entity')}).then(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.UPDATED_COMPANY');
    }).catch((err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public onClickSend() {
    if (!this._isSending) {
      this._isSending = true;
      this._innovationService.updateFollowUp(this._project._id, this._selectedIds, this._selectedPhrase).pipe(first()).subscribe(() => {
        this._innovationService.sendFollowUpEmails(this._project._id, this._selectedPhrase).pipe(first()).subscribe(() => {
          this.closeModal();
          this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SEND_EMAILS_OK');
          this._isSending = false;
          this.toggleStartContact(false);
        }, (err: HttpErrorResponse) => {
          this._isSending = false;
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        });
      }, (err: HttpErrorResponse) => {
        this._isSending = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

  public onChangeLang(value: string) {
    this._selectedLang = value;
  }

  public removeCc(index: number) {
    const value = this._selectedCC[index];
    this._selectedCC.splice(index, 1);
    this._saveProject({followUpEmails: this._followUpObj()}).then((_value) => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'SHARED_FOLLOW_UP.REMOVED_CC');
      this.initEmailObject();
    }).catch((err: HttpErrorResponse) => {
      this._selectedCC.push(value);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  private _followUpObj(update = 'cc'): InnovationFollowUpEmails {
    const followUp = this._project.followUpEmails;
    if (update === 'cc') {
      followUp.cc = this._selectedCC;
    }
    if (update === 'entity') {
      followUp.entity = this._companyName;
    }
    return followUp;
  }

  public onSelectCc(event: InnovationFollowUpEmailsCc) {
    this._ccToAdd = event;
  }

  public onClickAdd() {
    if (this._formData.valid) {
      const _value = this._formData.getRawValue();
      this.addCC(_value);
    }
  }

  public isExistCc(value: InnovationFollowUpEmailsCc): boolean {
    return this._selectedCC.some((_cc) => _cc.email.toLocaleLowerCase() === value.email.toLocaleLowerCase());
  }

  public addCC(value: InnovationFollowUpEmailsCc, fromSelect = false) {
    if (!this.isExistCc(value)) {
      this._selectedCC.push(value);
      this._saveProject({followUpEmails: this._followUpObj()}).then((_value) => {
        this.closeModal();
        this._formData.reset();
        this._translateNotificationsService.success('ERROR.SUCCESS', 'SHARED_FOLLOW_UP.ADDED_CC');
        if (fromSelect) {
          this._ccToAdd = <InnovationFollowUpEmailsCc>{};
        } else {
          this._cc.push(value);
        }
        this.initEmailObject();
      }).catch((err: HttpErrorResponse) => {
        this._selectedCC.pop();
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'COMMON.INVALID.ALREADY_USER_EMAIL');
    }
  }

  private _saveProject(object: any) {
    return new Promise((resolve, reject) => {
      this._innovationService.save(this._project._id, object).pipe(first()).subscribe(() => {
        resolve (true);
      }, (err) => {
        reject (err);
      });
    });
  }

  public closeModal() {
    this._showModal = false;
    this._sendShowModal = false;
    this._formData.reset();
  }

  public openModal() {
    this._showModal = true;
  }

  private _initVariables() {
    if (this._project && this._project._id) {
      this._cc = this._project.followUpEmails && this._project.followUpEmails.cc || [];
      this._langs = this._project.innovationCards.map((_card) => _card.lang) || [];
      this._selectedLang = this._langs[0];
      this._companyName = this._project.followUpEmails && this._project.followUpEmails.entity || '';
      this._selectedCC = this._cc;
      this._cc = [...this._cc, ...this._project.collaborators.map((_collaborator) => {
        return {
          firstName: _collaborator.firstName || '',
          lastName: _collaborator.lastName || '',
          email: _collaborator.email || ''
        };
      })];
    }
  }

  private _initFinaleTable() {
    this._finalTableInfos = {
      _selector: 'project-contact-send',
      _content: this._finalAnswers,
      _total: this._finalAnswers.length,
      _paginationTemplate: 'TEMPLATE_1',
      _isLocal: true,
      _columns: [
        {
          _attrs: ['professional.displayName'],
          _name: 'COMMON.LABEL.NAME',
          _type: 'TEXT',
          _width: '180px'
        },
        {
          _attrs: ['professional.jobTitle'],
          _name: 'COMMON.LABEL.JOBTITLE',
          _type: 'TEXT',
          _width: '180px'
        },
        {
          _attrs: ['professional.company.name'],
          _name: 'COMMON.LABEL.COMPANY',
          _type: 'TEXT',
          _width: '180px'
        },
      ]
    };
  }

  /**
   * TODO delete the commented part after multilang migration
   */
  public initEmailObject() {
    // this._emailsObject = JSON.parse(JSON.stringify(LangEntryService.followUpEmails(this._project.followUpEmails, this._selectedPhrase)));
    this._emailsObject = JSON.parse(JSON.stringify(InnovationFrontService.getFollowUpTemplate(
      this._project.followUpEmails?.templates, this._selectedPhrase)));
    this._emailsObjectReplaced = null;
    this._emailsObjectReplaced = JSON.parse(JSON.stringify(this._emailsObject));
    const cc = this._selectedCC.map((_cc) => {
      return UserFrontService.fullName(_cc);
    }).join(', ');

    this._langs.forEach((_lang) => {
      const _card = InnovationFrontService.currentLangInnovationCard(this._project, _lang, 'CARD');
      this._highlightFields(_lang, _card, cc);
      this._replaceVariables(_lang, _card, cc);
    });
  }

  /**
   * TODO delete the commented part after multilang migration
   * @param lang
   * @param card
   * @param cc
   * @private
   */
  private _highlightFields(lang: string, card: InnovCard, cc: string) {
    const index = LangEntryService.entryIndex(this._emailsObject.entry, 'lang', lang);

    if (index !== -1) {
      this._emailsObject.entry[index].subject = this._emailsObject.entry[index].subject
        .replace(/\*\|TITLE\|\*/g,
          `<span class="label is-mail width-120 is-sm m-h text-xs text-draft m-no-right">${card.title}</span>`
        );

      this._emailsObject.entry[index].content = this._emailsObject.entry[index].content
        .replace(/\*\|COMPANY_NAME\|\*/g, `<span class="label is-mail width-120 is-sm text-xs
       text-background m-h m-no-right">${new ScrapeHTMLTags().transform(this.companyName.trim())}</span>`)
        .replace(/\*\|CLIENT_NAME\|\*/g, `<span class="label is-mail width-120 is-sm text-xs text-background m-h m-no-right">${cc}</span>`)
        .replace(/\*\|TITLE\|\*/g, `<span class="label is-mail width-120 is-sm text-xs text-draft m-h m-no-right">${card.title}</span>`);
    }
    /*this._emailsObject[lang]['subject'] = this._emailsObject[lang]['subject']
      .replace(/\*\|TITLE\|\*!/g,
        `<span class="label is-mail width-120 is-sm m-h text-xs text-background m-no-right">${card.title}</span>`
      );*/

    /*this._emailsObject[lang]['content'] = this._emailsObject[lang]['content']
      .replace(/\*\|COMPANY_NAME\|\*!/g, `<span class="label is-mail width-120 is-sm text-xs
       text-background m-h m-no-right">${new ScrapeHTMLTags().transform(this.companyName.trim())}</span>`)
      .replace(/\*\|CLIENT_NAME\|\*!/g, `<span class="label is-mail width-120 is-sm text-xs text-background m-h m-no-right">${cc}</span>`)
      .replace(/\*\|TITLE\|\*!/g, `<span class="label is-mail width-120 is-sm text-xs text-background m-h m-no-right">${card.title}</span>`);*/
  }

  /**
   * TODO delete the commented part after multilang migration
   * @param lang
   * @param card
   * @param cc
   * @private
   */
  private _replaceVariables(lang: string, card: InnovCard, cc: string) {
    const index = LangEntryService.entryIndex(this._emailsObjectReplaced.entry, 'lang', lang);

    if (index !== -1) {
      this._emailsObjectReplaced.entry[index].subject = this._emailsObjectReplaced.entry[index].subject
        .replace(/\*\|TITLE\|\*/g, card.title);

      this._emailsObjectReplaced.entry[index].content = this._emailsObjectReplaced.entry[index].content
        .replace(/\*\|COMPANY_NAME\|\*/g, new ScrapeHTMLTags().transform(this.companyName.trim()))
        .replace(/\*\|CLIENT_NAME\|\*/g, cc)
        .replace(/\*\|TITLE\|\*/g, `${card.title}`);
    }

    /*this._emailsObjectReplaced[lang]['subject'] = this._emailsObjectReplaced[lang]['subject'].
    replace(/\*\|TITLE\|\*!/g, card.title);*/

    /*this._emailsObjectReplaced[lang]['content'] = this._emailsObjectReplaced[lang]['content']
      .replace(/\*\|COMPANY_NAME\|\*!/g, new ScrapeHTMLTags().transform(this.companyName.trim()))
      .replace(/\*\|CLIENT_NAME\|\*!/g, cc)
      .replace(/\*\|TITLE\|\*!/g, `${card.title}`);*/
  }

  public onChangePhrase(event: string) {
    this._selectedPhrase = event;
    this.initEmailObject();
  }

  public goToBackStep(event: Event) {
    event.preventDefault();
    this._currentStep--;
  }

  public goToNextStep(event: Event) {
    event.preventDefault();

    if (!this.isDisabled) {
      if (this._contactFields[this._currentStep] === 'STEP_SEND') {
        this._sendShowModal = true;
      } else {
        this._isNextStep = true;

        switch (this._contactFields[this._currentStep]) {
          case 'STEP_INTRO':
            this._sidebarTemplate.animate_state = 'active';
            this._tableInfos = <Table>{};
            const _filter = this._answers.filter((_answer) => !SharedFollowUpClientComponent._isRowDisabled(_answer));
            this._initTable(_filter, _filter.length);
            this.initEmailObject();
            break;
          case 'STEP_CONFIGURE':
            this._finalTableInfos = <Table>{};
            this._finalAnswers = JSON.parse(JSON.stringify(this._answers.filter((_answer) => !!_answer._isSelected)));
            this._initFinaleTable();
            break;
        }

        this._nextStepTimeout = setTimeout(() => {
          this._currentStep++;
          this._isNextStep = false;
        }, 250);
      }
    }
  }

  public rowsSelected(event: any) {
    this._selectedIds = event['_rows'].map((_answer: Answer) => _answer._id);
    this._answers.forEach((_answer) => {
      if (!SharedFollowUpClientComponent._isRowDisabled(_answer)) {
        _answer._isSelected = this._selectedIds.indexOf(_answer._id) > -1;
      }
    });
  }

  public toggleStartContact(value: boolean) {
    if (!this._isSending) {
      this.startContactProcessChange.emit(value);

      if (!value) {
        this._answers = [];
        this._initTable([], -1);
        this.reinitializeAnswers.emit();
        this._currentStep = 0;
        this._selectedCC = [];
        this._finalAnswers = [];
        this._filterService.reset();
        this._selectedIds = [];
      }
    }
  }

  public seeAnswer(answer: Answer) {
    this._modalAnswer = answer;
    this._sidebarAnswer = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.INSIGHT',
      size: '726px'
    };
  }

  public updateAnswers(answers: Array<Answer> = []) {
    this.rowsSelected({_rows: answers});
  }

  get answersCanBeSelected(): number {
    return this._answers.filter((_answer) => !SharedFollowUpClientComponent._isRowDisabled(_answer)).length;
  }

  get platformLang(): string {
    return this._translateService.currentLang;
  }

  get isValidCompany(): boolean {
    return !!this._companyName && !!this._companyName.trim();
  }

  get config(): UmiusConfigInterface {
    return this._config;
  }

  set config(value: UmiusConfigInterface) {
    this._config = value;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  set sendShowModal(value: boolean) {
    this._sendShowModal = value;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  set companyName(value: string) {
    this._companyName = value;
  }

  set finalConfig(value: UmiusConfigInterface) {
    this._finalConfig = value;
  }

  set sidebarAnswer(value: UmiusSidebarInterface) {
    this._sidebarAnswer = value;
  }

  set sidebarTemplate(value: UmiusSidebarInterface) {
    this._sidebarTemplate = value;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get cc(): Array<InnovationFollowUpEmailsCc> {
    return this._cc;
  }

  get contactFields(): Array<string> {
    return this._contactFields;
  }

  get currentStep(): number {
    return this._currentStep;
  }

  get introImages(): Array<string> {
    return this._introImages;
  }

  get isNextStep(): boolean {
    return this._isNextStep;
  }

  get phraseChoose(): Array<string> {
    return this._phraseChoose;
  }

  get selectedIds(): Array<string> {
    return this._selectedIds;
  }

  get selectedPhrase(): string {
    return this._selectedPhrase;
  }

  get modalAnswer(): Answer {
    return this._modalAnswer;
  }

  get sidebarAnswer(): UmiusSidebarInterface {
    return this._sidebarAnswer;
  }

  get sidebarTemplate(): UmiusSidebarInterface {
    return this._sidebarTemplate;
  }

  get steps(): Array<string> {
    return this._steps;
  }

  get emailsObject(): InnovationFollowUpEmailsTemplate {
    return this._emailsObject;
  }

  get emailsObjectReplaced(): InnovationFollowUpEmailsTemplate {
    return this._emailsObjectReplaced;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  get sendShowModal(): boolean {
    return this._sendShowModal;
  }

  get formData(): FormGroup {
    return this._formData;
  }

  get selectedCC(): Array<InnovationFollowUpEmailsCc> {
    return this._selectedCC;
  }

  get ccToAdd(): InnovationFollowUpEmailsCc {
    return this._ccToAdd;
  }

  get langs(): Array<string> {
    return this._langs;
  }

  get selectedLang(): string {
    return this._selectedLang;
  }

  get finalTableInfos(): Table {
    return this._finalTableInfos;
  }

  get finalConfig(): UmiusConfigInterface {
    return this._finalConfig;
  }

  get planeImage(): string {
    return this._planeImage;
  }

  get isSending(): boolean {
    return this._isSending;
  }

  get companyName(): string {
    return this._companyName;
  }

  get startContactProcess(): boolean {
    return this._startContactProcess;
  }

  get isDisabled(): boolean {
    switch (this._contactFields[this._currentStep]) {

      case 'STEP_SELECT':
        return !this._selectedIds.length;

      case 'STEP_CONFIGURE':
        return !this.isValidCompany || !this._selectedCC.length;

      default:
        return false;

    }
  }

  get project(): Innovation {
    return this._project;
  }

  ngOnDestroy(): void {
    clearTimeout(this._nextStepTimeout);
    this._subscribe.next();
    this._subscribe.complete();
  }

}
