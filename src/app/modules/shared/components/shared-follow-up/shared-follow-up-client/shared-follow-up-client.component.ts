import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Answer} from '../../../../../models/answer';
import {Table} from '../../../../table/models/table';
import {Config} from '../../../../../models/config';
import {Innovation, InnovationFollowUpEmailsCc} from '../../../../../models/innovation';
import {MissionQuestion} from '../../../../../models/mission';
import {SidebarInterface} from '../../../../sidebars/interfaces/sidebar-interface';
import {EmailsObject} from '../../../../../models/email';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';
import {InnovationFrontService} from '../../../../../services/innovation/innovation-front.service';
import {InnovCard} from '../../../../../models/innov-card';

@Component({
  selector: 'app-shared-follow-up-client',
  templateUrl: './shared-follow-up-client.component.html',
  styleUrls: ['./shared-follow-up-client.component.scss']
})
export class SharedFollowUpClientComponent implements OnInit, OnDestroy {

  set sendShowModal(value: boolean) {
    this._sendShowModal = value;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  set companyName(value: string) {
    this._companyName = value;
  }

  set finalConfig(value: Config) {
    this._finalConfig = value;
  }

  set sidebarAnswer(value: SidebarInterface) {
    this._sidebarAnswer = value;
  }

  set sidebarTemplate(value: SidebarInterface) {
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

  get sidebarAnswer(): SidebarInterface {
    return this._sidebarAnswer;
  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

  get steps(): Array<string> {
    return this._steps;
  }

  get emailsObject(): EmailsObject {
    return this._emailsObject;
  }

  get emailsObjectReplaced(): EmailsObject {
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

  get finalConfig(): Config {
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
        return !this._companyName || !this._selectedCC.length;

      default:
        return false;

    }
  }

  get project(): Innovation {
    return this._project;
  }

  @Input() set startContactProcess(value: boolean) {
    if (!!value) {
      this._initVariables();
    }
    this._startContactProcess = value;
  }

  @Input() questions: Array<MissionQuestion> = [];

  @Input() tableInfos: Table = <Table>{};

  @Input() config: Config = <Config>{};

  @Input() set answers (value: Array<Answer>) {
    this._answers = value;
    this._selectedIds = this._answers.filter((_answer) => _answer._isSelected)
      .map((_answer) => _answer._id);
  }

  @Input() set project(value: Innovation) {
    this._project = value;
    this._initVariables();
  }

  @Output() reinitializeAnswers: EventEmitter<void> = new EventEmitter<void>();

  @Output() reinitializeTable: EventEmitter<{answers: Array<Answer>, total: number}> =
    new EventEmitter<{answers: Array<Answer>, total: number}>();

  @Output() configChange: EventEmitter<Config> = new EventEmitter<Config>();

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

  private _sidebarAnswer: SidebarInterface = <SidebarInterface>{};

  private _sidebarTemplate: SidebarInterface = {
    animate_state: 'inactive',
    type: 'FOLLOW_UP'
  };

  private _steps: Array<string> = ['COMMON.LABEL.SELECTED', 'COMMON.LABEL.CONFIGURE', 'COMMON.LABEL.SEND'];

  private _emailsObject: EmailsObject = <EmailsObject>{};

  private _emailsObjectReplaced: EmailsObject = <EmailsObject>{};

  private _showModal = false;

  private _sendShowModal = false;

  private _formData: FormGroup = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  private _selectedCC: Array<InnovationFollowUpEmailsCc> = [];

  private _ccToAdd: InnovationFollowUpEmailsCc = <InnovationFollowUpEmailsCc>{};

  private _langs: Array<string> = [];

  private _selectedLang = '';

  private _finalTableInfos: Table = <Table>{};

  private _finalConfig: Config = {
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

  constructor(private _formBuilder: FormBuilder,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
  }

  public onClickSend() {
    if (!this._isSending) {
      this._isSending = true;
    }
  }

  public onChangeLang(value: string) {
    this._selectedLang = value;
  }

  public removeCc(index: number) {
    this._selectedCC.splice(index, 1);
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
      this.closeModal();
      this._formData.reset();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'SHARED_FOLLOW_UP.SUCCESSFUL_CC');

      if (fromSelect) {
        this._ccToAdd = <InnovationFollowUpEmailsCc>{};
      } else {
        this._cc.push(value);
      }
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'COMMON.INVALID.ALREADY_USER_EMAIL');
    }
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
      this._langs = ['fr', 'en'];
      this._selectedLang = this._langs[0];
      this._companyName = this._project.owner && this._project.owner.company && this._project.owner.company.name || '';
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
      _content: JSON.parse(JSON.stringify(this._answers.filter((_answer) => !!_answer._isSelected))),
      _total: this._selectedIds.length,
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

  public initEmailObject() {
    this._emailsObject = this._project.followUpEmails[this._selectedPhrase.toLocaleLowerCase()] || {};
    this._emailsObjectReplaced = null;
    this._emailsObjectReplaced = JSON.parse(JSON.stringify(this._emailsObject));
    const _owner = this._project.owner && this._project.owner.name || '';

    this._langs.forEach((_lang) => {
      const _card = InnovationFrontService.currentLangInnovationCard(this._project, _lang, 'CARD');
      this._highlightFields(_lang, _card, _owner);
      this._replaceVariables(_lang, _card, _owner);
    });
  }

  private _highlightFields(lang: string, card: InnovCard, owner: string) {
    this._emailsObject[lang].subject = this._emailsObject[lang].subject
      .replace(/\*\|TITLE\|\*/g,
      `<span class="label is-mail width-120 is-sm m-h text-xs text-background m-no-right">${card.title}</span>`
    );

    this._emailsObject[lang].content = this._emailsObject[lang].content
      .replace(/\*\|COMPANY_NAME\|\*/g, `<span class="label is-mail width-120 is-sm text-xs
       text-background m-h m-no-right">${this._companyName}</span>`)
      .replace(/\*\|CLIENT_NAME\|\*/g, `<span class="label is-mail width-120 is-sm text-xs text-background m-h m-no-right">${owner}</span>`)
      .replace(/\*\|TITLE\|\*/g, `<span class="label is-mail width-120 is-sm text-xs text-background m-h m-no-right">${card.title}</span>`);
  }

  private _replaceVariables(lang: string, card: InnovCard, owner: string) {
    this._emailsObjectReplaced[lang].subject = this._emailsObjectReplaced[lang].subject.
    replace(/\*\|TITLE\|\*/g, card.title);

    this._emailsObjectReplaced[lang].content = this._emailsObjectReplaced[lang].content
      .replace(/\*\|COMPANY_NAME\|\*/g, this._companyName)
      .replace(/\*\|CLIENT_NAME\|\*/g, owner)
      .replace(/\*\|TITLE\|\*/g, `${card.title}`);
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
            this.tableInfos = <Table>{};
            this.reinitializeTable.emit({answers: this._answers, total: this._answers.length});
            this.initEmailObject();
            break;
          case 'STEP_CONFIGURE':
            this._finalTableInfos = <Table>{};
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

  public rowsSelected(event: Array<any>) {
    this._selectedIds = event['_rows'].map((_answer: Answer) => _answer._id);
    this._answers.forEach((_answer) => {
      _answer._isSelected = this._selectedIds.indexOf(_answer._id) > -1;
    });
  }

  public toggleStartContact(value: boolean) {
    if (!this._isSending) {
      this.startContactProcessChange.emit(value);

      if (!value) {
        this._answers = [];
        this.reinitializeTable.emit({answers: [], total: -1});
        this.reinitializeAnswers.emit();
        this._currentStep = 0;
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

  public closeSidebar() {
    this._sidebarTemplate = {
      animate_state: 'inactive'
    };
  }

  public updateAnswers(answers: Array<Answer>) {
    if (answers && answers.length) {
      this.reinitializeTable.emit({answers: answers, total: answers.length});
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this._nextStepTimeout);
  }

}
