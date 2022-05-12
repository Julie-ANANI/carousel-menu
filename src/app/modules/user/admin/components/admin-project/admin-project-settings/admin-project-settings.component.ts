import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Innovation,
  InnovationStatus,
} from '../../../../../../models/innovation';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { StatsInterface } from '../../../../../../models/stats';
import {
  MissionMilestone,
  Mission, MissionQuestion,
  MissionType,
} from '../../../../../../models/mission';
import { User } from '../../../../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MissionService } from '../../../../../../services/mission/mission.service';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { DashboardService } from '../../../../../../services/dashboard/dashboard.service';
import { UserFrontService } from '../../../../../../services/user/user-front.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { ClientProject } from '../../../../../../models/client-project';
import { UserService } from '../../../../../../services/user/user.service';
import { Response } from '../../../../../../models/response';
import { ClientProjectService } from '../../../../../../services/client-project/client-project.service';
import { CommonService } from '../../../../../../services/common/common.service';
import { Tag } from '../../../../../../models/tag';
import { TranslateService } from '@ngx-translate/core';
import { domainRegEx, emailRegEx } from '../../../../../../utils/regex';
import { MissionFrontService } from '../../../../../../services/mission/mission-front.service';
import { picto, Picto } from '../../../../../../models/static-data/picto';
import { StatsReferentsService } from '../../../../../../services/stats-referents/stats-referents.service';
import { Community } from '../../../../../../models/community';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { Blacklist, BlacklistDomain } from '../../../../../../models/blacklist';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {UmiusSidebarInterface} from '@umius/umi-common-component';
import {ActivatedRoute} from '@angular/router';
import {CacheType} from '../../../../../../models/cache';

export interface UserSuggestion {
  name: string;
  _id: string;
  email: string;
}

@Component({
  templateUrl: './admin-project-settings.component.html',
  styleUrls: ['./admin-project-settings.component.scss'],
})
export class AdminProjectSettingsComponent implements OnInit, OnDestroy {

  get showModalDone(): boolean {
    return this._showModalDone;
  }

  set showModalDone(value: boolean) {
    this._showModalDone = value;
  }

  private _isLoading = true;

  private _innovation: Innovation = <Innovation>{};

  private _mission: Mission = <Mission>{};

  private _missionTypes: Array<string> = ['USER', 'CLIENT', 'DEMO', 'TEST'];

  private _operators: Array<User> = [];

  private _isAddMilestone = false;

  private _milestoneForm: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required]],
    dueDate: ['', [Validators.required]],
  });

  private _commercials: Array<User> = [];

  private _clientProject: ClientProject = <ClientProject>{};

  private _isEditingOwner = false;

  private _newOwner: UserSuggestion = <UserSuggestion>{};

  private _quizLink = '';

  private _sidebarValue: UmiusSidebarInterface = <UmiusSidebarInterface>{};

  private _dateFormat = CommonService.dateFormat(this.currentLang, true);

  private _innovationStatus: Array<InnovationStatus> = [
    'EDITING',
    'SUBMITTED',
    'EVALUATING',
    'DONE',
  ];

  private _domains: Array<{ name: string }> = [
    {name: 'umi'},
    {name: 'dynergie'},
    {name: 'novanexia'},
    {name: 'inomer'},
    {name: 'multivalente'},
    {name: 'salveo'},
    {name: 'schneider'},
    {name: 'bnpparibas'},
  ];

  private _statsConfig: Array<StatsInterface> = [];

  private _missionTeam: string[] = [];

  private _picto: Picto = picto;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _showModal = false;

  private _isPublishingCommunity = false;

  private _blacklistDomains: Array<string> = [];

  private _canDeactivateFollowUp = false;

  private _orginalMilestone: Array<MissionMilestone> = [];

  private _milestones: Array<MissionMilestone> = [];

  private _showModalDone = false;

  private _showModalRemoveLang = false;

  private _isSaving = false;

  private _isValid = false;

  private _checked = {
    project : false,
    questionnaire: false,
    workflow: false,
    batch: false
  };

  //private _projectLanguage = ['english', 'français', 'español'];

  private _selectedLanguages = ['español', 'dutch'];//  = []

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _answerService: AnswerService,
              private _rolesFrontService: RolesFrontService,
              private _activatedRoute: ActivatedRoute,
              private _missionService: MissionService,
              private _dashboardService: DashboardService,
              private _innovationService: InnovationService,
              private _userService: UserService,
              private _translateService: TranslateService,
              private _clientProjectService: ClientProjectService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService,
              private _statsReferentsService: StatsReferentsService,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._innovation = this._innovationFrontService.innovation().value;
      this._initFields();
      this._getValidAnswers();
      this._getOperators();
      this._getCommercials();
      this._getStats();
      this._quizLink = InnovationFrontService.quizLink(this._innovation);
      this._isLoading = false;

      this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
        if (innovation && innovation._id) {
          this._innovation = innovation;
          this._initFields();
        }
      });
    }
  }

  private _initFields() {
    if (!!this._innovation.mission) {
      this._mission = <Mission>this._innovation.mission;
      this._missionTeam = this._mission.team.map((user: User) => user.id);
      this.initRoadmap();
    }

    if (!!this._innovation.clientProject) {
      this._clientProject = <ClientProject>this._innovation.clientProject;
    }
  }

  private _getStats(cache: CacheType = '') {
    if(this.canAccess(['view', 'stats'])) {
      this._statsReferentsService.get(cache).pipe(first()).subscribe((referents) => {
        this._setStats(referents.innovations);
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  private initRoadmap(){
    this._milestones = MissionFrontService.sortMilestoneDates(this._mission.milestoneDates);
    this._orginalMilestone = JSON.parse(JSON.stringify(this._milestones));
  }

  private _getValidAnswers() {
    if (isPlatformBrowser(this._platformId)) {
      this._activatedRoute.parent.params.subscribe((params) => {
        if (params && params.projectId) {
          this._answerService.getInnovationValidAnswers(params.projectId).pipe(first()).subscribe((response) => {
            this._canDeactivateFollowUp = !(response && response.answers &&
              response.answers.filter((_answer) => !!(_answer.followUp && _answer.followUp.date)).length);
          }, (err: HttpErrorResponse) => {
            this._canDeactivateFollowUp = false;
            console.error(err);
          });
        }
      });
    }
  }

  private _getCommercials() {
    this._userService
      .getCommercials()
      .pipe(first())
      .subscribe(
        (response: Response) => {
          this._commercials = response.result;
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Commercial Fetching Error...', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        }
      );
  }

  private _getOperators() {
    this._dashboardService
      .getOperators()
      .pipe(first())
      .subscribe(
        (response: Response) => {
          this._operators = response.result;
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Operators Fetching Error...', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        }
      );
  }

  private _setStats(referents: {
    openRate: number;
    clickToOpenRate: number;
    quizAttractiveness: number;
    answerRate: number;
  }) {
    this._statsConfig = [
      {
        heading: 'Emails',
        content: [
          {
            subHeading: 'To send',
            value:
              this._innovation.stats &&
              (this._innovation.stats.emailsOK ||
                this._innovation.stats.emailsOK === 0)
                ? this._innovation.stats.emailsOK.toString(10)
                : 'NA',
          },
          {
            subHeading: 'Delivered',
            value:
              this._innovation.stats &&
              (this._innovation.stats.received ||
                this._innovation.stats.received === 0)
                ? this._innovation.stats.received.toString(10)
                : 'NA',
            stats: {
              title: 'Number of emails sent, \n all shots combined',
              values: [
                {
                  name: 'Shot 1',
                  value:
                    this._innovation.stats &&
                    (this._innovation.stats.nbFirstMail ||
                      this._innovation.stats.nbFirstMail === 0)
                      ? this._innovation.stats.nbFirstMail
                      : 'NA',
                },
                {
                  name: 'Shot 2',
                  value:
                    this._innovation.stats &&
                    (this._innovation.stats.nbSecondMail ||
                      this._innovation.stats.nbSecondMail === 0)
                      ? this._innovation.stats.nbSecondMail
                      : 'NA',
                },
                {
                  name: 'Shot 3',
                  value:
                    this._innovation.stats &&
                    (this._innovation.stats.nbThirdMail ||
                      this._innovation.stats.nbThirdMail === 0)
                      ? this._innovation.stats.nbThirdMail
                      : 'NA',
                },
              ],
            },
          },
          {
            subHeading: 'Open rate',
            value: CommonService.getRate(
              this._innovation.stats && this._innovation.stats.opened,
              this._innovation.stats && this._innovation.stats.received
            ),
            gauge: {
              title: `${
                (this._innovation.stats && this._innovation.stats.opened) || 0
              } opened / ${
                (this._innovation.stats && this._innovation.stats.received) || 0
              } delivered`,
              referent: referents.openRate || 50,
              delimitersLabels: [
                'Unattractive title, to be adjusted',
                'Title partly attractive, to be checked',
                'Attractive title',
                'Very attractive title',
              ],
            },
          },
          {
            subHeading: 'Click to open rate',
            value: CommonService.getRate(
              this._innovation.stats && this._innovation.stats.clicked,
              this._innovation.stats && this._innovation.stats.opened
            ),
            gauge: {
              title: `${
                (this._innovation.stats && this._innovation.stats.clicked) || 0
              } clicked / ${
                (this._innovation.stats && this._innovation.stats.opened) || 0
              } opened`,
              referent: referents.clickToOpenRate || 50,
              delimitersLabels: [
                'Unattractive pitch, to be adjusted',
                'Pitch partly attractive, to be checked',
                'Attractive pitch',
                'Very attractive pitch',
              ],
            },
          },
        ],
      },
      {
        heading: 'Answers',
        content: [
          {
            subHeading: 'Quiz attractiveness',
            value: CommonService.getRate(
              this._innovation.stats && this._innovation.stats.answers,
              this._innovation.stats && this._innovation.stats.clicked
            ),
            gauge: {
              title: `${
                (this._innovation.stats && this._innovation.stats.answers) || 0
              } received answers / ${
                (this._innovation.stats && this._innovation.stats.clicked) || 0
              } quiz views`,
              referent: referents.quizAttractiveness || 50,
              delimitersLabels: [
                'Unattractive quiz, to be adjusted',
                'Quiz partly attractive, to be checked',
                'Attractive quiz',
                'Very attractive quiz',
              ],
            },
          },
          {
            subHeading: 'Validated answers',
            value:
              this._innovation.stats &&
              (this._innovation.stats.validatedAnswers ||
                this._innovation.stats.validatedAnswers === 0)
                ? this._innovation.stats.validatedAnswers.toString(10)
                : 'NA',
          },
          {
            subHeading: 'Answer rate',
            value: CommonService.getRate(
              this._innovation.stats && this._innovation.stats.validatedAnswers,
              this._innovation.stats && this._innovation.stats.nbFirstMail
            ),
            gauge: {
              title: `${
                (this._innovation.stats &&
                  this._innovation.stats.validatedAnswers) ||
                0
              } validated answers / ${
                (this._innovation.stats &&
                  this._innovation.stats.nbFirstMail) ||
                0
              } pros contacted`,
              referent: referents.answerRate || 50,
              delimitersLabels: [
                'Unattractive project',
                'Project partly attractive',
                'Attractive project',
                'Very attractive project',
              ],
            },
          },
        ],
      },
    ];
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project', 'settings'];
    return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
  }

  public onRemoveLanguages(event: Event) {
    event.preventDefault();
    this._showModalRemoveLang = true;
  }

  public checked(event: Event){
    event.preventDefault();

    const elementId: string = (event.target as Element).id;
    this._checked[elementId] = true;
    if (Object.values(this._checked).every(value => value)){
      this._isValid = true;
    }
  }
  public closeModal(event: Event) {
    event.preventDefault();
    this._showModalRemoveLang = false;
  }

  public onConfirmDeleteLang(event: Event) {
    event.preventDefault();
    if (!this._isSaving) {
      this._isSaving = true;
    }
    this._innovationService.removeLanguage(this.innovation._id, this._selectedLanguages).pipe(first()).subscribe(() => {
      this.closeModal(event);
      this._translateNotificationsService.success('Project Status Success...', 'The project status has been updated to Done.');
      this._isSaving = false;
    }, (err: HttpErrorResponse) => {
      this._isSaving = false;
      this._translateNotificationsService.error('Project Status Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
    this.closeModal(event);
    this._translateNotificationsService.success('Project Status Success...', 'The project status has been updated to Done.');
  }

  private _emitUpdatedInnovation() {
    this._innovationFrontService.setInnovation(this._innovation);
  }

  /***
   * this is to update the banner stats.
   */
  public onClickUpdateStats() {
    this._innovationService.updateStats(this._innovation._id).pipe(first()).subscribe((innovation: Innovation) => {
      this._innovation.stats = innovation.stats;
      this._emitUpdatedInnovation();
      this._getStats('reset');
      this._translateNotificationsService.success('Success', 'The stats have been updated.');
    },(err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Stats Updating Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public onMissionTypeChange(type: MissionType) {
    this._mission.type = type;
    this._saveMission(
      {type: this._mission.type},
      'The market test type has been updated.'
    );
  }

  public onChangeMissionTeam(operator: User) {
    const _index = this._mission.team.findIndex(
      (op) => op.id === operator['_id']
    );
    if (_index > -1) {
      this._mission.team.splice(_index, 1);
      this._missionTeam.splice(_index, 1);
    } else {
      this._mission.team.push(operator);
      this._missionTeam.push(operator['_id']);
    }
    this._saveMission(
      {team: this._mission.team},
      'The team members have been updated.'
    );
  }

  private _saveMission(
    missionObj: { [P in keyof Mission]?: Mission[P] },
    notifyMessage = 'The project has been updated.'
  ) {
    this._missionService
      .save(this._mission._id, missionObj)
      .pipe(first())
      .subscribe(
        (_) => {
          this._translateNotificationsService.success('Success', notifyMessage);
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Mission Updating Error...', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        }
      );
  }

  /***
   * when we update the operator we add him in the mission team also that's why we send the mission object also to
   * update the mission team.
   */
  public onOperatorChange(operatorId: string) {
    const _index = this._operators.findIndex(
      (op: any) => op._id === operatorId
    );
    this._innovation.operator = _index !== -1 ? this._operators[_index] : null;

    if (!this.isTeamMember(operatorId) && this._operators[_index]) {
      this._mission.team.push(this._operators[_index]);
      this._missionTeam.push(operatorId);
    }

    this._saveProject('The operator and team members have been updated.', {
      operator: this._innovation.operator,
      mission: this._mission,
    });
  }

  /***
   * no need to initialize the back object we get to the innovation because we already have the
   * updated object and will only fetch the object when we reload the page.
   * We just notify the updated object using service so that other component using that also have the updated one.
   * @param notifyMessage
   * @param saveObject
   * @private
   */
  private _saveProject(
    notifyMessage = 'The project has been updated.',
    saveObject: any
  ) {
    this._innovationService
      .save(this._innovation._id, saveObject)
      .pipe(first())
      .subscribe(
        () => {
          this._translateNotificationsService.success('Success', notifyMessage);
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Project Updating Error...', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        }
      );
  }

  public onCommercialChange(commercialId: string) {
    const _index = this._commercials.findIndex(
      (commercial: any) => commercial._id === commercialId
    );
    this._clientProject.commercial =
      _index !== -1 ? this._commercials[_index] : null;
    this._saveClientProject('The commercial has been updated.');
  }

  private _saveClientProject(notifyMessage = 'The project has been updated.') {
    // Ugly hack: commercial needs to be an _id to be saved on the back-end
    const tmpProject: any = this._clientProject;
    tmpProject.commercial = tmpProject.commercial._id;

    this._clientProjectService
      .save(this._clientProject._id, tmpProject)
      .pipe(first())
      .subscribe(
        (clientProject: ClientProject) => {
          this._clientProject = clientProject;
          this._innovation.clientProject = this._clientProject;
          this._emitUpdatedInnovation();
          this._translateNotificationsService.success('Success', notifyMessage);
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Client Project Error...', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        }
      );
  }

  public isTeamMember(operatorId: string): boolean {
    const _index =
      this._missionTeam &&
      this._missionTeam.findIndex((id) => id === operatorId);
    return _index > -1;
  }

  public onEdit(type: string) {
    switch (type) {
      case 'OWNER':
        this._newOwner = <UserSuggestion>{};
        this._isEditingOwner = !this._isEditingOwner;
        break;

      case 'PROJECT_TAGS':
        this._openSidebar(
          'ADD_TAGS',
          this.canAccess(['edit', 'projectTags']) ? 'Add Tags' : 'Project Tags'
        );
        break;

      case 'ROADMAP':
        this._openSidebar(
          'ROADMAP',
          this.canAccess(['edit', 'roadmap']) ? 'Edit roadmap' : 'Mission'
        );
        break;

      case 'BLOCKLIST':
        this._openSidebar('EXCLUDE_EMAILS_DOMAINS', 'Edit Blocklist');
        break;

      case 'PUBLISH_COMMUNITY':
        if (this._innovation.isPublic && !this._innovation.published) {
          this._openModal();
        }
        break;
    }
  }

  private _openModal() {
    this._showModal = true;
  }

  /**
   *
   * @param value
   */
  public publishCommunity(value: Community) {
    if (!this._isPublishingCommunity) {
      this._isPublishingCommunity = true;

      this._innovationService
        .publishToCommunity(this._innovation._id, value)
        .pipe(first())
        .subscribe(
          (response) => {
            this._isPublishingCommunity = false;
            this._showModal = false;
            if (!!response) {
              this._innovation.published = response.published;
              this._innovation.community = response.community;
              this._emitUpdatedInnovation();
              this._translateNotificationsService.success(
                'Success',
                'The project has been published to the Community.'
              );
            } else {
              this._innovation.published = null;
              this._innovation.community = <Community>{};
            }
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error('Publish Error...', ErrorFrontService.getErrorKey(err.error));
            console.error(err);
            this._isPublishingCommunity = false;
          }
        );
    }
  }

  private _openSidebar(type: string, title: string) {
    this._sidebarValue = {
      animate_state: 'active',
      type: type,
      title: title,
    };
    if (type === 'ROADMAP') {
      this._sidebarValue.size = '600px';
    }
  }

  public selectOwner(value: UserSuggestion) {
    this._newOwner = value;
  }

  get selectedLanguages(): any[] {
    return this._selectedLanguages;
  }

  get isLangSelected(): boolean{
    return this._selectedLanguages.length>0;
  }


  public saveOwner(event: Event) {
    event.preventDefault();
    this._innovation.owner = <any>this._newOwner;
    this._isEditingOwner = false;

    if (this._newOwner && this._newOwner._id) {
      this._saveProject('The owner has been updated.', {
        owner: this._innovation.owner,
      });
    }
  }

  public addProjectTags(tags: Array<Tag>) {
    this._innovation.tags = tags;
    this._saveProject('The tags have been updated.', {
      tags: this._innovation.tags,
    });
  }

  public isMilestoneReached(date: Date): boolean {
    return date ? new Date(date) <= new Date() : false;
  }

  public isNextMilestoneReached(index: number): boolean {
    if (
      this._mission.milestoneDates[index] &&
      this._mission.milestoneDates[index].dueDate
    ) {
      return (
        new Date(this._mission.milestoneDates[index].dueDate) <= new Date()
      );
    }
    return false;
  }

  public addBlocklist(values: Blacklist) {
    if (values.emails.length || values.domains.length) {
      const _domainExp = domainRegEx;
      const _emailExp = emailRegEx;

      if (values.domains) {
        this._innovation.settings.blacklist.domains = [];

        values.domains.forEach((value: BlacklistDomain) => {
          const _domain = !!value.domain ? `*@${value.domain}` : value.name;
          if (_domainExp.test(_domain)) {
            this._innovation.settings.blacklist.domains.push(_domain.split('@')[1]);
          } else {
            this._translateNotificationsService.success('Error', `The domain ${_domain} format is not correct.`);
          }
        });
      }

      if (values.emails) {
        this._innovation.settings.blacklist.emails = [];
        values.emails.forEach((value: any) => {
          if (_emailExp.test(value.text)) {
            this._innovation.settings.blacklist.emails.push(value.text);
          }
        });
      }

      this._saveProject('The blacklists have been updated.', {
        settings: this._innovation.settings,
      });
    }
  }

  /**
   * for the moment we do not publish the innovation of mission type Identifying receptive markets
   * at the community.
   */
  public canPublishAtCommunity(): boolean {
    return MissionFrontService.objectiveName((this._mission && this._mission.template)) !== 'Identifying receptive markets';
  }

  public onUpdateStatus(status: InnovationStatus) {
    if (status === 'DONE') {
      this._showModalDone = true;
    } else {
      this._innovation.status = status;
      const saveObject: any = {};
      saveObject.status = this._innovation.status;
      if (status === 'EVALUATING') {
        if (this._mission._id && this._mission.type === 'USER') {
          this._mission.type = 'CLIENT';
        }
      }
      this._saveProject('The status has been updated.', saveObject);
    }
  }

  public onStatusUpdated(event: boolean) {
    if (event) {
      this._innovation.status = 'DONE';
      this._innovationFrontService.setInnovation(this._innovation);
    }
  }

  public onChangeAnonymous(event: Event) {
    if (this._innovation._metadata) {
      if (this._innovation._metadata['campaign']) {
        this._innovation._metadata['campaign']['anonymous_answers'] = (event.target as HTMLInputElement).checked;
      } else {
        this._innovation._metadata['campaign'] = {
          'anonymous_answers': (event.target as HTMLInputElement).checked
        };
      }
    } else {
      this._innovation._metadata = {
        'campaign': {
          'anonymous_answers': (event.target as HTMLInputElement).checked
        }
      };
    }
    this._saveProject(
      (event.target as HTMLInputElement).checked
        ? 'The answers will be anonymous.'
        : 'The answers won\'t be anonymous.',
      {_metadata: this._innovation._metadata}
    );
  }

  public onChangeDomain(domain: string) {
    this._innovation.domain = domain;
    this._saveProject('The domain has been updated.', {
      domain: this._innovation.domain,
    });
  }

  public onChangeFollowUp(event: Event) {
    if (this._canDeactivateFollowUp) {
      const followUpEmails = this._innovation.followUpEmails;
      const newStatus = (event.target as HTMLInputElement).checked ? 'ACTIVE' : 'INACTIVE';

      if (!!followUpEmails.noFollow || !!followUpEmails.opening || !!followUpEmails.interview) {
        this._translateNotificationsService.error(
          'Follow-up Module...', 'It can\'t be deactivated as the emails have already been sent.'
        );
      } else {
        followUpEmails.status = newStatus;
        this._innovation.followUpEmails = followUpEmails;
        const message = `The follow-up module is ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} at the client side.`;
        this._saveProject(message, {followUpEmails: followUpEmails});
      }
    }
  }

  public onChangeIsPublic(event: Event) {
    this._innovation.isPublic = (event.target as HTMLInputElement).checked;
    this._saveProject(
      this._innovation.isPublic
        ? 'The project is published to the Innovation Showroom.'
        : 'The project is not published to the Innovation Showroom.',
      {isPublic: this._innovation.isPublic}
    );
  }

  public onRevisionProject(event: Event) {
    event.preventDefault();
    if (
      this._innovation.status === 'SUBMITTED' &&
      this.canAccess(['edit', 'projectRevision'])
    ) {
      this._innovation.status = 'EDITING';
      this._saveProject(
        'The project has been placed in revision status, ' +
        'please notify the owner of the changes to be made.',
        {status: this._innovation.status}
      );
    }
  }

  public onValidateProject(event: Event) {
    event.preventDefault();
    if (
      this.canAccess(['edit', 'validateProject']) &&
      this._innovation.status === 'SUBMITTED'
    ) {
      this._innovation.status = 'EVALUATING';
      const saveObject: any = {status: this._innovation.status};
      if (this._mission._id && this._mission.type === 'USER') {
        this._mission.type = 'CLIENT';
        saveObject.mission = this._mission;
      }
      this._saveProject('The project has been validated.', saveObject);
    }
  }

  public name(value: User): string {
    return UserFrontService.fullName(value);
  }

  public objectiveName(value: any): string {
    return MissionFrontService.objectiveName(value, this.currentLang);
  }

  addMilestone(event: Event) {
    event.preventDefault();
    this._isAddMilestone = true;
  }

  confirmAddMileStone(event: Event) {
    event.preventDefault();
    this._isAddMilestone = false;
    const milestone = {
      name: this.milestoneForm.get('name').value,
      dueDate: this.milestoneForm.get('dueDate').value,
      code: '',
      comment: ''
    };
    this._milestones.push(milestone);
    this._mission.milestoneDates = this._milestones;
    this.initRoadmap();
    this._saveMission(this._mission);
  }


  cancelAddMileStone(event: Event) {
    event.preventDefault();
    this._isAddMilestone = false;
    this._milestoneForm.reset();
  }

  getInitialDomains() {
    this._blacklistDomains = [];
    if (this._innovation.settings && this._innovation.settings.blacklist) {
      this._blacklistDomains = this._innovation.settings.blacklist.domains;
    }
    if (this._innovation.owner && this._innovation.owner.company && this._innovation.owner.company.domain) {
      if (this._blacklistDomains.indexOf(this._innovation.owner.company.domain) === -1) {
        this._blacklistDomains.push(this._innovation.owner.company.domain);
      }
    }
    this._innovation.settings.blacklist.domains = JSON.parse(JSON.stringify(this._blacklistDomains));
  }

  openQuiz($event: Event) {
    $event.preventDefault();
    if (this._quizLink) {
      window.open(this._quizLink, '_blank');
    }
  }

  editMilestone(milestone: MissionMilestone, type: string) {
    milestone['edit' + type] = true;
  }

  disableEditing(event: Event, milestone: MissionMilestone, type: string) {
    event.preventDefault();
    milestone['edit' + type] = false;
    this._milestones = JSON.parse(JSON.stringify(this._orginalMilestone));
  }

  validateRoadmap(event: KeyboardEvent, milestone: MissionMilestone, type: string) {
    event.preventDefault();
    if (event.keyCode === 13) {
      if (milestone.name && milestone.dueDate) {
        this._mission.milestoneDates = this._milestones;
        this.initRoadmap();
        this._saveMission(this._mission, 'The roadmap has been updated.');
      } else {
        this._milestones = JSON.parse(JSON.stringify(this._orginalMilestone));
        this._translateNotificationsService.error('Input Error...', 'Invalide roadmap');
      }
      milestone['edit' + type] = false;
    }
  }

  dueDateOnChange(event: any, milestone: MissionMilestone) {
    milestone.dueDate = new Date(event);
  }

  removeMilestone(event: Event, i: number) {
    this._milestones =  this._milestones.filter((milestone, index )=> index !== i);
    this._mission.milestoneDates = this._milestones;
    this.initRoadmap();
    this._saveMission(this._mission, 'The roadmap has been deleted.');
  }

  get quizLink(): string {
    return this._quizLink;
  }

  get sidebarValue(): UmiusSidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: UmiusSidebarInterface) {
    this._sidebarValue = value;
  }

  get dateFormat(): string {
    return this._dateFormat;
  }

  get innovationStatus(): Array<InnovationStatus> {
    return this._innovationStatus;
  }

  get domains(): Array<{ name: string }> {
    return this._domains;
  }

  get statsConfig(): Array<StatsInterface> {
    return this._statsConfig;
  }

  set isPublishingCommunity(value: boolean) {
    this._isPublishingCommunity = value;
  }

  get blacklistDomains(): Array<string> {
    return this._blacklistDomains;
  }

  get picto(): Picto {
    return this._picto;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get isPublishingCommunity(): boolean {
    return this._isPublishingCommunity;
  }


  get isAddMilestone(): boolean {
    return this._isAddMilestone;
  }

  get milestoneForm(): FormGroup {
    return this._milestoneForm;
  }

  get canDeactivateFollowUp(): boolean {
    return this._canDeactivateFollowUp;
  }

  get hasMissionTemplate(): boolean {
    return MissionFrontService.hasMissionTemplate(this._mission);
  }

  get templateComplementary(): Array<MissionQuestion> {
    return this.hasMissionTemplate && MissionFrontService.combineComplementaryObjectives(this._mission.template.sections) || [];
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get innovTags(): Array<Tag> {
    if (this._sidebarValue.animate_state === 'active') {
      return this._innovation.tags;
    }
    return [];
  }

  get milestones(): Array<MissionMilestone> {
    return this._milestones;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get mission(): Mission {
    return this._mission;
  }

  set mission(value: Mission) {
    this._mission = value;
  }

  get missionTypes(): Array<string> {
    return this._missionTypes;
  }

  get operators(): Array<User> {
    return this._operators;
  }

  get commercials(): Array<User> {
    return this._commercials;
  }

  get clientProject(): ClientProject {
    return this._clientProject;
  }

  get isEditingOwner(): boolean {
    return this._isEditingOwner;
  }

  get newOwner(): UserSuggestion {
    return this._newOwner;
  }

  get showModalRemoveLang(): boolean {
    return this._showModalRemoveLang;
  }
  get isSaving(): boolean {
    return this._isSaving;
  }
  get isValid(): boolean {
    return this._isValid;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
