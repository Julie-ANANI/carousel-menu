import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Innovation, InnovationStatus} from '../../../../../../models/innovation';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {StatsInterface} from '../../admin-stats-banner/admin-stats-banner.component';
import {Milestone, Mission, MissionType} from '../../../../../../models/mission';
import {User} from '../../../../../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import {MissionService} from '../../../../../../services/mission/mission.service';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {DashboardService} from '../../../../../../services/dashboard/dashboard.service';
import {UserFrontService} from '../../../../../../services/user/user-front.service';
import {InnovationService} from '../../../../../../services/innovation/innovation.service';
import {ClientProject} from '../../../../../../models/client-project';
import {UserService} from '../../../../../../services/user/user.service';
import {Response} from '../../../../../../models/response';
import {ClientProjectService} from '../../../../../../services/client-project/client-project.service';
import {AutocompleteService} from '../../../../../../services/autocomplete/autocomplete.service';
import {Objective, ObjectivesPrincipal} from '../../../../../../models/static-data/missionObjectives';
import {environment} from '../../../../../../../environments/environment';
import {CommonService} from '../../../../../../services/common/common.service';
import {SidebarInterface} from '../../../../../sidebars/interfaces/sidebar-interface';
import {Tag} from '../../../../../../models/tag';
import {TranslateService} from '@ngx-translate/core';
import {domainRegEx, emailRegEx} from '../../../../../../utils/regex';
import {MissionFrontService} from '../../../../../../services/mission/mission-front.service';

interface UserSuggestion {
  name: string;
  _id: string;
}

@Component({
  templateUrl: './admin-project-settings.component.html',
  styleUrls: ['./admin-project-settings.component.scss']
})

export class AdminProjectSettingsComponent implements OnInit, OnDestroy {

  private _isLoading = true;

  private _innovation: Innovation = <Innovation>{};

  private _mission: Mission = <Mission>{};

  private _missionTypes: Array<string> = ['USER', 'CLIENT', 'DEMO', 'TEST'];

  private _operators: Array<User> = [];

  private _commercials: Array<User> = [];

  private _clientProject: ClientProject = <ClientProject>{};

  private _isEditingOwner = false;

  private _newOwner: UserSuggestion = <UserSuggestion>{};

  private _usersSuggestion: Array<UserSuggestion> = [];

  private _missionObjectives: Array<Objective> = ObjectivesPrincipal;

  private _quizLink = '';

  private _quizUrlCopied = false;

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  private _dateFormat = this._translateService.currentLang === 'en' ? 'y/MM/dd' : 'dd/MM/y';

  private _innovationStatus: Array<InnovationStatus> = ['EDITING', 'SUBMITTED', 'EVALUATING', 'DONE'];

  private _domains: Array<{name: string}> = [
    {name: 'umi'},
    {name: 'dynergie'},
    {name: 'novanexia'},
    {name: 'inomer'},
    {name: 'multivalente'},
    {name: 'salveo'},
    {name: 'schneider'},
    {name: 'bnpparibas'}
  ];

  private _statsConfig: Array<StatsInterface> = [];

  private _missionTeam: string[];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _rolesFrontService: RolesFrontService,
              private _missionService: MissionService,
              private _dashboardService: DashboardService,
              private _innovationService: InnovationService,
              private _autoCompleteService: AutocompleteService,
              private _userService: UserService,
              private _commonService: CommonService,
              private _translateService: TranslateService,
              private _clientProjectService: ClientProjectService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._getOperators();
      this._getCommercials();

      this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
        this._innovation = innovation || <Innovation>{};
        this._setStats();
        this._setQuizLink();

        if (!!this._innovation.mission) {
          this._mission = <Mission>this._innovation.mission;
          this._missionTeam = this._mission.team.map((user: User) => user.id);
        }

        if (!!this._innovation.clientProject) {
          this._clientProject = <ClientProject>this._innovation.clientProject;
        }

      });

    }
  }

  private _getCommercials() {
    this._userService.getCommercials().pipe(first()).subscribe((response: Response) => {
      this._commercials = response.result;
      }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Commercial Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  private _getOperators() {
    this._dashboardService.getOperators().pipe(first()).subscribe((response: Response) => {
      this._operators = response.result;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Operator Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  private _setQuizLink() {
    if (this._innovation.quizId && Array.isArray(this._innovation.campaigns) && this._innovation.campaigns.length > 0) {
      this._quizLink = `${environment.quizUrl}/quiz/${this._innovation.quizId}/${this._innovation.campaigns[0]._id}` || '';
    }
  }

  private _setStats() {
    this._statsConfig = [
      {
        heading: 'Emails',
        content: [
          {
            subHeading: 'To send',
            value: (this._innovation.stats && (this._innovation.stats.emailsOK
              || this._innovation.stats.emailsOK === 0) ? this._innovation.stats.emailsOK : 'NA')
          },
          {
            subHeading: 'Delivered',
            value: (this._innovation.stats && (this._innovation.stats.received
              || this._innovation.stats.received === 0) ? this._innovation.stats.received : 'NA')
          },
          {
            subHeading: 'Open rate',
            value: AdminProjectSettingsComponent._getRate(this._innovation.stats && this._innovation.stats.opened
              , this._innovation.stats && this._innovation.stats.received)
          },
          {
            subHeading: 'Click rate',
            value: AdminProjectSettingsComponent._getRate(this._innovation.stats && this._innovation.stats.clicked
              , this._innovation.stats && this._innovation.stats.opened)
          }
        ]
      },
      {
        heading: 'Answers',
        content: [
          {
            subHeading: 'Questionnaire quality',
            value: AdminProjectSettingsComponent._getRate(this._innovation.stats && this._innovation.stats.answers
              , this._innovation.stats && this._innovation.stats.clicked)
          },
          {
            subHeading: 'Validated answers',
            value: (this._innovation.stats && (this._innovation.stats.validatedAnswers
              || this._innovation.stats.validatedAnswers === 0) ? this._innovation.stats.validatedAnswers : 'NA')
          },
          {
            subHeading: 'Answer rate',
            value: 'NA'
          }
        ]
      }
    ];
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project', 'settings'];
    return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
  }

  /***
   * this is to update the banner stats.
   */
  public onClickUpdateStats() {
    this._innovationService.updateStats(this._innovation._id).pipe(first()).subscribe((innovation: Innovation) => {
      this._innovation = innovation;
      this._innovationFrontService.setInnovation(this._innovation);
      this._translateNotificationsService.success('Success', 'The stats have been updated.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Stats Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public onMissionTypeChange(type: MissionType) {
    this._mission.type = type
    this._saveMission('The market test type has been updated.');
  }

  public onChangeMissionTeam(operator: User) {
    const _index = this._mission.team.findIndex((op) => op.id === operator['_id']);
    if (_index > -1) {
      this._mission.team.splice(_index, 1);
      this._missionTeam.splice(_index, 1);
    } else {
      this._mission.team.push(operator);
      this._missionTeam.push(operator['_id']);
    }
    this._saveMission('The team members have been updated.');
  }

  private _saveMission(notifyMessage = 'The project has been updated.') {
    this._missionService.save(this._mission._id, this._mission).pipe(first()).subscribe((mission) => {
      this._translateNotificationsService.success('Success', notifyMessage);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Mission Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public onOperatorChange(operatorId: string) {
    const _index = this._operators.findIndex((op: any) => op._id === operatorId);
    this._innovation.operator = _index !== -1 ? this._operators[_index] : null;

    if (!this.isTeamMember(operatorId) && this._operators[_index]) {
      this._mission.team.push(this._operators[_index]);
      this._missionTeam.push(operatorId);
    }

    this._saveProject('The operator and team members have been updated.');

  }

  private _saveProject(notifyMessage = 'The project has been updated.') {
    this._innovationService.save(this._innovation._id, this._innovation).pipe(first()).subscribe((inno: Innovation) => {
      this._innovationFrontService.setInnovation(inno);
      this._translateNotificationsService.success('Success' , notifyMessage);
      }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Project Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public onCommercialChange(commercialId: string) {
    const _index = this._commercials.findIndex((commercial: any) => commercial._id === commercialId);
    this._clientProject.commercial = _index !== -1 ? this._commercials[_index] : null;
    this._saveClientProject('The commercial has been updated.');
  }

  private _saveClientProject(notifyMessage = 'The project has been updated.') {
    this._clientProjectService.save(this._clientProject._id, this._clientProject).pipe(first()).subscribe((clientProject: ClientProject) => {
      this._clientProject = clientProject;
      this._translateNotificationsService.success('Success' , notifyMessage);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Client Project Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });

  }

  public isTeamMember(operatorId: string): boolean {
    const _index = this._missionTeam && this._missionTeam.findIndex((id) => id === operatorId);
    return _index > -1;
  }

  public onEdit(type: string) {
    switch (type) {

      case 'OWNER':
        this._newOwner = <UserSuggestion>{};
        this._isEditingOwner = !this._isEditingOwner;
        break;

      case 'PROJECT_TAGS':
        this._openSidebar('ADD_TAGS', this.canAccess(['edit', 'projectTags']) ? 'Add Tags' : 'Project Tags');
        break;

      case 'ROADMAP':
        this._openSidebar('ROADMAP', this.canAccess(['edit', 'roadmap']) ? 'Edit roadmap' : 'Mission');
        break;

      case 'BLOCKLIST':
        this._openSidebar('EXCLUDE_EMAILS_DOMAINS', 'Edit Blocklist');
        break;

    }
  }

  private _openSidebar(type: string, title: string) {
    this._sidebarValue = {
      animate_state: 'active',
      type: type,
      title: title
    }
  }

  public suggestUser(value: string) {
    if (value) {
      this._autoCompleteService.get({query: value, type: 'users'})
        .pipe(takeUntil(this._ngUnsubscribe)).subscribe((res: any) => {
        if (res.length === 0) {
          this._usersSuggestion = [];
        } else {
          res.forEach((items: any) => {
            const valueIndex = this._usersSuggestion.findIndex((user) => user._id === items._id);
            if (valueIndex === -1) { // if not exist then push into the array.
              this._usersSuggestion.push({name: items.name, _id: items._id});
            }
          });
        }
      });
    }
  }

  public selectOwner(value: UserSuggestion) {
    this._newOwner = value;
    this._usersSuggestion = [];
  }

  public saveOwner(event: Event) {
    event.preventDefault();
    this._innovation.owner = <any>this._newOwner;
    this._saveProject('The owner has been updated.');
  }

  public onMainObjectiveChange(objective: string) {
    const _index = this._missionObjectives.findIndex((value) => value['en']['label'] === objective);
    if (_index !== -1) {

      if (!this._mission.objective) {
        this._mission.objective = {
          principal: {},
          secondary: [],
          comment: ''
        };
      }

      this._mission.objective.principal = {
        en: this._missionObjectives[_index].en.label,
        fr: this._missionObjectives[_index].fr.label,
      };

      this._saveMission('The main objective has been updated.')

    }
  }

  public onCopyQuizLink(event: Event) {
    event.preventDefault();
    if (this._quizLink) {
      this._commonService.copyToClipboard(this._quizLink);
      this._quizUrlCopied = true;
      setTimeout(() => {
        this._quizUrlCopied = false;
      }, 8000);
    }
  }

  public addProjectTags(tags: Array<Tag>) {
    this._innovation.tags = tags;
    this._saveProject('The tags have been updated.');
  }

  public isMilestoneReached(date: Date): boolean {
    return date ? new Date(date) <= new Date() : false;
  }

  public isNextMilestoneReached(index: number): boolean {
    if (this._mission.milestoneDates[index] && this._mission.milestoneDates[index].dueDate) {
      return new Date(this._mission.milestoneDates[index].dueDate) <= new Date();
    }
    return false;
  }

  public addBlocklist(values: {emails: Array<string>, domains: Array<string>}) {
    if (values.emails.length || values.domains.length) {
      const _domainExp = domainRegEx;
      const _emailExp = emailRegEx;

      if (values.domains.length) {
        this._innovation.settings.blacklist.domains = [];
        values.domains.forEach((value: any) => {
          if (_domainExp.test(value.text)) {
            this._innovation.settings.blacklist.domains.push(value.text.split('@')[1]);
          }
        });
      }

      if (values.emails.length) {
        this._innovation.settings.blacklist.emails = [];
        values.emails.forEach((value: any) => {
          if (_emailExp.test(value.text)) {
            this._innovation.settings.blacklist.emails.push(value.text);
          }
        });
      }

      this._saveProject('The blocklist have been updated.');

    }
  }

  public onUpdateStatus(status: InnovationStatus) {
    this._innovation.status = status;
    this._saveProject('The status has been updated.');
  }

  public onChangeAnonymous(event: Event) {
    if (this._innovation._metadata && this._innovation._metadata['campaign']  && this._innovation._metadata['campaign']['anonymous_answers']) {
      this._innovation._metadata['campaign']['anonymous_answers'] = (event.target as HTMLInputElement).checked;
    } else {
      this._innovation._metadata = this._innovation._metadata['campaign']['anonymous_answers'] = (event.target as HTMLInputElement).checked;
    }
    this._saveProject((event.target as HTMLInputElement).checked
      ? 'The answers will be anonymous.' : 'The answers won\'t be anonymous.')
  }

  public onChangeDomain(domain: string) {
    this._innovation.domain = domain;
    this._saveProject('The domain has been updated.');
  }

  public onChangeIsPublic(event: Event) {
    this._innovation.isPublic = (event.target as HTMLInputElement).checked;
    this._saveProject(this._innovation.isPublic
      ? 'The project is published to the Innovation Showroom.' : 'The project is not published to the Innovation Showroom.')
  }

  public onPublishCommunity(event: Event) {
    if (this._innovation.isPublic) {
      this._innovationService.publishToCommunity(this._innovation._id).pipe(first()).subscribe((published) => {
        if (published) {
          this._innovation['published'] = published;
          this._translateNotificationsService.success('Success', 'The project has been published to the Community.');
        } else {
          this._innovation['published'] = null;
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Project Error...', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    }
  }

  private static _getRate(value1: number, value2: number, decimals?: number): string {
    const power = decimals ? Math.pow(10, decimals) : 100;
    if (value2 && (value1 || value1 === 0)) {
      return (Math.round(100 * power * value1 / value2) / power).toString() + '%';
    }
    return 'NA';
  }

  public onRevisionProject(event: Event) {
    event.preventDefault();
    if (this._innovation.status === 'SUBMITTED' && this.canAccess(['edit', 'projectRevision'])) {
      this._innovation.status = 'EDITING';
      this._saveProject('The project has been placed in revision status, ' +
        'please notify the owner of the changes to be made.');
    }
  }

  public onValidateProject(event: Event) {
    event.preventDefault();
    if (this.canAccess(['edit', 'validateProject']) && this._innovation.status === 'SUBMITTED') {
      this._innovation.status = 'EVALUATING';
      if (this._mission._id && this._mission.type === 'USER') {
        this._mission.type = 'CLIENT';
      }
      this._saveProject('The project has been validated.');
    }
  }

  public name(value: User): string {
    return UserFrontService.fullName(value);
  }

  get innovTags(): Array<Tag> {
    if (this._sidebarValue.animate_state === 'active') {
      return this._innovation.tags;
    }
    return [];
  }

  get milestones(): Array<Milestone> {
    return MissionFrontService.sortMilestoneDates(this._mission.milestoneDates);
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

  get usersSuggestion(): Array<UserSuggestion> {
    return this._usersSuggestion;
  }

  get missionObjectives(): Array<Objective> {
    return this._missionObjectives;
  }

  get quizLink(): string {
    return this._quizLink;
  }

  get quizUrlCopied(): boolean {
    return this._quizUrlCopied;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
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

  get missionTeam(): string[] {
    return this._missionTeam;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
