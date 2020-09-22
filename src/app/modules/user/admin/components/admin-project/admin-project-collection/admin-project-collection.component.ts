import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';
import {Subject} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {first, takeUntil} from 'rxjs/operators';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {StatsInterface} from '../../admin-stats-banner/admin-stats-banner.component';
import {Config} from '../../../../../../models/config';
import {ConfigService} from '../../../../../../services/config/config.service';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {Campaign} from '../../../../../../models/campaign';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {AnswerService} from '../../../../../../services/answer/answer.service';
import {Table} from '../../../../../table/models/table';
import {CampaignFrontService} from '../../../../../../services/campaign/campaign-front.service';
import {Answer} from '../../../../../../models/answer';
import {SidebarInterface} from '../../../../../sidebars/interfaces/sidebar-interface';
import {Question} from '../../../../../../models/question';
import {CampaignService} from '../../../../../../services/campaign/campaign.service';
import {Section} from '../../../../../../models/section';
import {Company} from '../../../../../../models/company';

@Component({
  templateUrl: './admin-project-collection.component.html',
  styleUrls: ['./admin-project-collection.component.scss']
})

export class AdminProjectCollectionComponent implements OnInit {

  isLoading = true;

  innovation: Innovation = <Innovation>{};

  statsConfig: Array<StatsInterface> = [];

  localConfig: Config = {
    fields: '',
    limit: this._configService.configLimit('admin-project-collection'),
    offset: '0',
    search: '{}',
    $or: '[{"_id": "5f03324de410e50c0171fd4b"}, {"_id": "5b17d0520a7f5bd3b779f728"}]',
    sort: '{ "created": -1 }'
  };

  campaignConfig: Config = {
    fields: '',
    limit: '',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  }

  selectedCampaign: Campaign = <Campaign>{};

  isImportingAnswers = false;

  totalAnswers = -1;

  tableData: Table = <Table>{};

  allAnswers: Array<Answer> = [];

  sidebarAnswer: Answer = <Answer>{};

  sidebarValue: SidebarInterface = <SidebarInterface>{};

  questions: Array<Question> = [];

  excludedCompanies: Array<Company> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _answerService: AnswerService,
              private _campaignService: CampaignService,
              private _rolesFrontService: RolesFrontService,
              private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this.isLoading = false;
      this._initTable();
      this._setStats();

      this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
        this.innovation = innovation || <Innovation>{};
        this._initQuestions();
        this.excludedCompanies = this.innovation && this.innovation.settings && this.innovation.settings.companies
          && this.innovation.settings.companies.exclude;

        /*'$or': JSON.stringify([{roles: 'market-test-manager-umi'}, {roles: 'oper-supervisor'}]),
          $or: '[{"_id": "5f03324de410e50c0171fd4b"}, {"_id": "5b17d0520a7f5bd3b779f728"}]',
        this.campaignConfig*/
        console.log(this.innovation.campaigns);
      });

    }
  }

  private _initQuestions() {
    if (this.innovation.preset && this.innovation.preset.sections && Array.isArray(this.innovation.preset.sections)) {
      this.innovation.preset.sections.forEach((section: Section) => {
        this.questions = this.questions.concat(section.questions || []);
      });
    }
  }

  private _campaignStat(type: string, searchKey?: any): number {
    return CampaignFrontService.answerStat(this.allAnswers, type, searchKey);
  }

  private _setStats() {
    this.statsConfig = [
      {
        heading: 'Answers',
        content: [
          { subHeading: 'Answer rate', value: this._campaignStat('answer_rate').toString(10) },
          { subHeading: 'Validated', value: this._campaignStat('status', 'VALIDATED').toString(10) },
          {
            subHeading: 'Auto-validated',
            value: this._campaignStat('status', 'VALIDATED_UMIBOT').toString(10)
          },
          {
            subHeading: 'Auto-rejected',
            value: this._campaignStat('status', 'REJECTED_UMIBOT').toString(10)
          },
          { subHeading: 'Submitted', value: this._campaignStat('status', 'SUBMITTED').toString(10) },
          {
            subHeading: 'Rejected by email',
            value: this._campaignStat('status', 'REJECTED_GMAIL').toString(10)
          },
          { subHeading: 'Rejected', value: this._campaignStat('status', 'REJECTED').toString(10) }
        ]
      }
    ];
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project', 'answers'];
    return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
  }

  public onImport(file: File) {
    if (!this.isImportingAnswers && this.selectedCampaign._id) {
      this.isImportingAnswers = true;
      this._answerService.importAsCsv(this.selectedCampaign._id, file).pipe(first()).subscribe(() => {
        this._translateNotificationsService.success('Success', 'The answers has been imported.');
        this.isImportingAnswers = false;
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Importing Error...', ErrorFrontService.getErrorMessage(err.status));
        this.isImportingAnswers = false
        console.error(err);
      });
    }
  }

  public onExport() {
    if (this.selectedCampaign._id) {
      this._answerService.exportAsCsvByCampaign(this.selectedCampaign._id, false);
    }
  }

  private _initTable() {
    this.tableData = {
      _selector: 'admin-project-collection',
      _title: 'answers',
      _content: this.allAnswers,
      _total: this.totalAnswers,
      _isPaginable: true,
      _isTitle: true,
      _isLocal: true,
      _isNoMinHeight: this.totalAnswers < 11,
      _isSearchable: !!this.canAccess(['searchBy']) || !!this.canAccess(['filterBy']),
      _isSelectable: this.canAccess(['validate']) || this.canAccess(['reject']),
      _buttons: [
        {_label: 'Validate', _icon: 'fas fa-check', _isHidden: !this.canAccess(['validate'])},
        {_label: 'Reject', _icon: 'fas fa-times', _isHidden: !this.canAccess(['reject'])}
      ],
      _columns: [
        {
          _attrs: ['professional.firstName', 'professional.lastName'],
          _name: 'Name',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'name']),
          _isHidden: !this.canAccess(['tableColumns', 'name'])
        },
        {
          _attrs: ['country'],
          _name: 'Country',
          _type: 'COUNTRY',
          _width: '120px',
          _isSearchable: this.canAccess(['searchBy', 'country']),
          _isHidden: !this.canAccess(['tableColumns', 'country'])
        },
        {
          _attrs: ['professional.jobTitle'],
          _name: 'Job',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'job']),
          _isHidden: !this.canAccess(['tableColumns', 'job'])
        },
        {
          _attrs: ['scoreStatus'],
          _name: 'Validation Score',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'validationScore']),
          _isHidden: !this.canAccess(['tableColumns', 'validationScore']),
          _width: '180px'
        },
        {
          _attrs: ['updated'],
          _name: 'Updated',
          _type: 'DATE',
          _width: '150px',
          _isSearchable: this.canAccess(['searchBy', 'updated']),
          _isHidden: !this.canAccess(['tableColumns', 'updated'])
        },
        {
          _attrs: ['created'],
          _name: 'Created',
          _type: 'DATE',
          _width: '150px',
          _isSearchable: this.canAccess(['searchBy', 'created']),
          _isHidden: !this.canAccess(['tableColumns', 'created'])
        },
        {
          _attrs: ['status'],
          _name: 'Status',
          _type: 'MULTI-CHOICES',
          _isSearchable: this.canAccess(['filterBy', 'status']),
          _isHidden: !this.canAccess(['tableColumns', 'status']),
          _width: '180px',
          _choices: [
            {_name: 'VALIDATED', _alias: 'Validated', _class: 'label is-success'},
            {_name: 'SUBMITTED', _alias: 'Submitted', _class: 'label is-progress'},
            {_name: 'REJECTED', _alias: 'Rejected', _class: 'label is-danger'},
            {_name: 'REJECTED_GMAIL', _alias: 'Rejected by mail', _class: 'label is-danger'},
            {_name: 'VALIDATED_UMIBOT', _alias: 'Auto validated', _class: 'label is-progress'},
            {_name: 'REJECTED_UMIBOT', _alias: 'Auto rejected', _class: 'label is-progress'}
          ]
        },
        {
          _attrs: ['campaign'],
          _name: 'Campaign',
          _type: 'MULTI-CHOICES',
          _isSearchable: true,
          _isHidden: true,
          _choices: []
        }
      ]
    }
  }

  public onEdit(answer: Answer) {
    this.sidebarAnswer = answer;
    this.sidebarValue = {
      animate_state: 'active',
      title: 'Insight',
      size: '726px'
    };
  }

}
