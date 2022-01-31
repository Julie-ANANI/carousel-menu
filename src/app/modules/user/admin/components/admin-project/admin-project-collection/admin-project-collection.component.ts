import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { first, takeUntil } from 'rxjs/operators';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { StatsInterface } from '../../../../../../models/stats';
import { ConfigService } from '@umius/umi-common-component/services/config';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { Answer, AnswerStatus } from '../../../../../../models/answer';
import { SidebarInterface } from '../../../../../sidebars/interfaces/sidebar-interface';
import { Question } from '../../../../../../models/question';
import { Company } from '../../../../../../models/company';
import { SocketService } from '../../../../../../services/socket/socket.service';
import { Professional } from '../../../../../../models/professional';
import { MissionQuestion } from '../../../../../../models/mission';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { Table, Config } from '@umius/umi-common-component/models';
import { CommonService } from "../../../../../../services/common/common.service";

@Component({
  templateUrl: './admin-project-collection.component.html',
})
export class AdminProjectCollectionComponent implements OnInit, OnDestroy {
  private _isLoading = true;

  private _innovation: Innovation = <Innovation>{};

  private _statsConfig: Array<StatsInterface> = [];

  private _localConfig: Config = {
    fields: '',
    limit: this._configService.configLimit('admin-project-collection'),
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }',
  };

  private _selectedCampaign = '';

  private _isImportingAnswers = false;

  private _importingError = '';

  private _tableData: Table = <Table>{};

  private _answers: Array<Answer> = [];

  private _sidebarAnswer: Answer = <Answer>{};

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  private _questions: Array<Question | MissionQuestion> = [];

  private _excludedCompanies: Array<Company> = [];

  private _campaignList: Array<{ _name: ''; _alias: '' }> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _socketListening = false;

  private _targetWarnings = 0;

  private _accessPath: Array<string> = ['projects', 'project', 'campaigns', 'campaign', 'search'];

  private static _campaignStat(
    answers: Array<Answer>,
    type: string,
    searchKey?: any
  ): number {
    return CampaignFrontService.answerStat(answers, type, searchKey);
  }

  constructor(
    @Inject(PLATFORM_ID) protected _platformId: Object,
    private _configService: ConfigService,
    private _translateNotificationsService: TranslateNotificationsService,
    private _answerService: AnswerService,
    private _rolesFrontService: RolesFrontService,
    private _socketService: SocketService,
    private _innovationFrontService: InnovationFrontService
  ) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._initVariables(this._answers, -1);

      this._innovationFrontService
        .innovation()
        .pipe(takeUntil(this._ngUnsubscribe))
        .subscribe((innovation) => {
          this._innovation = innovation || <Innovation>{};
          this._getAnswers();
          this._initQuestions();
          this._excludedCompanies =
            this._innovation &&
            this._innovation.settings &&
            this._innovation.settings.companies &&
            this._innovation.settings.companies.exclude;

          // Listen to the updates only the first time we retrieve the innovation
          if (!this._socketListening) {
            this._socketService
              .getAnswersUpdates(this._innovation._id)
              .pipe(takeUntil(this._ngUnsubscribe))
              .subscribe(
                (update: any) => {
                  const answer = update.data;
                  answer._id = answer.id;
                  const index = this._answers.findIndex(
                    (a) => a._id.toString() === answer._id.toString()
                  );
                  this._answers[index] = answer;
                  this._initAnswers();
                },
                (error) => {
                  console.error(error);
                }
              );
            this._socketListening = true;
          }
        });
    }
  }

  private _getAnswers() {
    this._answerService
      .innovationAnswers(this._innovation._id)
      .pipe(first())
      .subscribe(
        (response) => {
          this._answers = response.answers;
          this._targetWarnings = this._areThereWarnings();
          this._answers.forEach((answer) => {
            if (answer.professional &&
              !answer.professional.jobTitle && answer.job) {
              answer.professional.jobTitle = answer.job;
            }
            if (answer.campaign &&
              this._campaignList.findIndex(
                (list) => list._name === answer.campaign['_id']
              ) === -1
            ) {
              this._campaignList.push({
                _name: answer.campaign['_id'],
                _alias: answer.campaign['title'],
              });
            }
          });
          this._initAnswers();
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Answers Error...', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        }
      );
  }

  /**
   * Counts how many answers are off target
   * @private
   */
  private _areThereWarnings(): number {
    return this._answers.filter(ans => {
      return !!ans.warnings ? ans.warnings.length > 0 : false;
    }).length;
  }

  private _initAnswers() {
    if (this._selectedCampaign) {
      const _filterAnswers = this._answers.filter((answer) => {
        return answer.campaign['_id'] === this._selectedCampaign;
      });
      this._initVariables(_filterAnswers, _filterAnswers.length);
    } else {
      this._initVariables(this._answers, this._answers.length);
    }
  }

  private _initVariables(answers: Array<Answer>, totalAnswers: number) {
    this._setStats(answers);
    this._initTable(answers, totalAnswers);
  }

  private _initQuestions() {
    this._questions = InnovationFrontService.questionsList(this._innovation);
  }

  private _setStats(answers: Array<Answer>) {
    this._statsConfig = [
      {
        heading: 'Answers',
        content: [
          {
            subHeading: 'Answer rate',
            value: CommonService.getRate(
              this._innovation.stats && this._innovation.stats.validatedAnswers,
              this._innovation.stats && this._innovation.stats.nbFirstMail
            )
          },
          {
            subHeading: 'Validated',
            value: AdminProjectCollectionComponent._campaignStat(
              answers,
              'status',
              'VALIDATED'
            ).toString(10),
          },
          {
            subHeading: 'Auto-validated',
            value: AdminProjectCollectionComponent._campaignStat(
              answers,
              'status',
              'VALIDATED_UMIBOT'
            ).toString(10),
          },
          {
            subHeading: 'Auto-rejected',
            value: AdminProjectCollectionComponent._campaignStat(
              answers,
              'status',
              'REJECTED_UMIBOT'
            ).toString(10),
          },
          {
            subHeading: 'Submitted',
            value: AdminProjectCollectionComponent._campaignStat(
              answers,
              'status',
              'SUBMITTED'
            ).toString(10),
          },
          {
            subHeading: 'Rejected by email',
            value: AdminProjectCollectionComponent._campaignStat(
              answers,
              'status',
              'REJECTED_GMAIL'
            ).toString(10),
          },
          {
            subHeading: 'Rejected',
            value: AdminProjectCollectionComponent._campaignStat(
              answers,
              'status',
              'REJECTED'
            ).toString(10),
          },
        ],
      },
    ];
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project', 'answers'];
    return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
  }

  public openImportModal() {
    this._importingError = '';
    this._isImportingAnswers = true;
  }

  public onImport(errorMessage: string) {
    if(errorMessage) {
      this._importingError = errorMessage
    } else {
      this._isImportingAnswers = false;
    }
  }

  public onExport() {
    if (this._selectedCampaign) {
      this._answerService.exportAsCsvByCampaign(this._selectedCampaign, false);
    }
  }

  private _initTable(answers: Array<Answer>, totalAnswers: number) {
    this._tableData = {
      _selector: 'admin-project-collection',
      _title: 'answers',
      _content: answers,
      _total: totalAnswers,
      _isPaginable: true,
      _isTitle: true,
      _isLocal: true,
      _hasCustomFilters: true,
      _isNoMinHeight: totalAnswers < 11,
      _clickIndex:
        this.canAccess(['view']) || this.canAccess(['edit']) ? 1 : null,
      _isSearchable:
        !!this.canAccess(['searchBy']) || !!this.canAccess(['filterBy']),
      _isSelectable: this.canAccess(['validate']) || this.canAccess(['reject']),
      _buttons: [
        {
          _label: 'Validate',
          _icon: 'fas fa-check',
          _isHidden: !this.canAccess(['validate']),
        },
        {
          _label: 'Reject',
          _icon: 'fas fa-times',
          _isHidden: !this.canAccess(['reject']),
        },
      ],
      _columns: [
        {
          _attrs: ['professional.firstName', 'professional.lastName'],
          _name: 'Name',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'name']),
          _isHidden: !this.canAccess(['tableColumns', 'name']),
          _searchTooltip:
            'Utilisez "prénom,nom" pour faire des recherches de personnes',
        },
        {
          _attrs: ['country'],
          _name: 'Country',
          _type: 'COUNTRY',
          _width: '120px',
          _isSearchable: this.canAccess(['searchBy', 'country']),
          _isHidden: !this.canAccess(['tableColumns', 'country']),
        },
        {
          _attrs: ['professional.jobTitle'],
          _name: 'Job',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'job']),
          _isHidden: !this.canAccess(['tableColumns', 'job']),
        },
        {
          _attrs: ['company.name'],
          _name: 'Company',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'company']),
          _isHidden: !this.canAccess(['tableColumns', 'company']),
        },
        {
          _attrs: ['scoreStatus'],
          _name: 'Validation Score',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'validationScore']),
          _isHidden: !this.canAccess(['tableColumns', 'validationScore']),
          _width: '180px',
        },
        {
          _attrs: ['updated'],
          _name: 'Updated',
          _type: 'DATE',
          _width: '150px',
          _isSearchable: this.canAccess(['searchBy', 'updated']),
          _isHidden: !this.canAccess(['tableColumns', 'updated']),
        },
        {
          _attrs: ['created'],
          _name: 'Created',
          _type: 'DATE',
          _width: '150px',
          _isSearchable: this.canAccess(['searchBy', 'created']),
          _isHidden: !this.canAccess(['tableColumns', 'created']),
        },
        {
          _attrs: ['campaign._id'],
          _name: 'Campaign',
          _type: 'MULTI-CHOICES',
          _isSearchable: true,
          _isHidden: true,
          _isCustomFilter: true,
          _choices: this._campaignList,
        },
        {
          _attrs: ['status'],
          _name: 'Status',
          _type: 'MULTI-CHOICES',
          _isSearchable: this.canAccess(['filterBy', 'status']),
          _isHidden: !this.canAccess(['tableColumns', 'status']),
          _width: '180px',
          _choices: [
            {
              _name: 'VALIDATED',
              _alias: 'Validated',
              _class: 'label is-success',
            },
            {
              _name: 'SUBMITTED',
              _alias: 'Submitted',
              _class: 'label is-progress',
            },
            {
              _name: 'REJECTED',
              _alias: 'Rejected',
              _class: 'label is-danger',
            },
            {
              _name: 'REJECTED_GMAIL',
              _alias: 'Rejected by mail',
              _class: 'label is-danger',
            },
            {
              _name: 'VALIDATED_UMIBOT',
              _alias: 'Auto validated',
              _class: 'label is-progress',
            },
            {
              _name: 'REJECTED_UMIBOT',
              _alias: 'Auto rejected',
              _class: 'label is-progress',
            },
          ],
        },
      ],
    };
  }

  public onEdit(answer: Answer) {
    this._sidebarAnswer = answer;
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Insight',
      size: '726px',
    };
  }

  public onCustomFilter(filter: { key: string; value: any }) {
    this._selectedCampaign = filter.value.toString();
    this._initAnswers();
  }

  public onActions(action: any) {
    switch (action._action) {
      case 'Validate':
        this._updateStatus(action._rows, 'VALIDATED');
        break;

      case 'Reject':
        this._updateStatus(action._rows, 'REJECTED');
        break;
    }
  }

  private _updateStatus(answers: Answer[], status: AnswerStatus) {
    answers.forEach((answer: Answer, index) => {
      answer.status = status;
      this._answerService
        .save(answer._id, answer)
        .pipe(first())
        .subscribe(
          _ans => {
            this._translateNotificationsService.success(
              'Success',
              'The answer has been updated.'
            );
            if (index === answers.length - 1) {
              this._getAnswers();
            }
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error('Answer Update Error...', ErrorFrontService.getErrorKey(err.error));
            console.error(err);
          }
        );
    });
  }

  updatePros(value: any) {
    const proToUpdate = this._answers.find((item) => item._id === value._id);
    proToUpdate.professional = !proToUpdate.professional
      ? <Professional>{}
      : proToUpdate.professional;
    proToUpdate.professional.firstName = value.newPro.firstName;
    proToUpdate.professional.lastName = value.newPro.lastName;
    proToUpdate.professional.email = value.newPro.email;
    if (value.newPro.jobTitle) {
      proToUpdate.professional.jobTitle = value.newPro.jobTitle;
      proToUpdate.job = value.newPro.jobTitle;
    }
    if (value.newPro.company) {
      proToUpdate.company.name = value.newPro.company;
    }
    if (value.newPro.country) {
      proToUpdate.country = value.newPro.country.flag;
    }
  }

  updateAnswersTable(value: boolean) {
    this._initAnswers();
  }

  /**
   * Updates one answer when saved from the sidebar (using the object sent back when we called the PUT route)
   * @param answer {Answer}
   */
  updateOneAnswer(answer: Answer) {
    // Search for the answer
    const idx = this._answers.findIndex(ans => {
      return ans._id === answer._id;
    });
    if (idx > -1) {
      this._answers[idx] = answer;
    }
  }

  public closeModal(event: Event) {
    event.preventDefault();
    this._isImportingAnswers = false;
    this._importingError = '';
  }

  get localConfig(): Config {
    return this._localConfig;
  }

  set localConfig(value: Config) {
    this._localConfig = value;
  }

  get sidebarAnswer(): Answer {
    return this._sidebarAnswer;
  }

  set sidebarAnswer(value: Answer) {
    this._sidebarAnswer = value;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get statsConfig(): Array<StatsInterface> {
    return this._statsConfig;
  }

  get selectedCampaign(): string {
    return this._selectedCampaign;
  }

  get isImportingAnswers(): boolean {
    return this._isImportingAnswers;
  }

  get tableData(): Table {
    return this._tableData;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get questions(): Array<Question | MissionQuestion> {
    return this._questions;
  }

  get excludedCompanies(): Array<Company> {
    return this._excludedCompanies;
  }

  get campaignList(): Array<{ _name: ''; _alias: '' }> {
    return this._campaignList;
  }

  /**
   * Get the number of answers off target
   */
  get targetWarnings(): number {
    return this._targetWarnings;
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

  get importingError(): string {
    return this._importingError;
  }

  set isImportingAnswers(value: boolean) {
    this._isImportingAnswers = value;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
