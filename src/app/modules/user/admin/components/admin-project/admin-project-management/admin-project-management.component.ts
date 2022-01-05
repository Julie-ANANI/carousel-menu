import {Component, OnInit} from '@angular/core';
import {InnovationService} from '../../../../../../services/innovation/innovation.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Tag} from '../../../../../../models/tag';
import {TranslateNotificationsService} from '../../../../../../services/translate-notifications/translate-notifications.service';
import {Innovation} from '../../../../../../models/innovation';
import {ActivatedRoute, Router} from '@angular/router';
import {SidebarInterface} from '../../../../../sidebars/interfaces/sidebar-interface';
import {Observable, Subject} from 'rxjs';
import {distinctUntilChanged, first} from 'rxjs/operators';
import {AutocompleteService} from '../../../../../../services/autocomplete/autocomplete.service';
import {DashboardService} from '../../../../../../services/dashboard/dashboard.service';
import {UserService} from '../../../../../../services/user/user.service';
import {User} from '../../../../../../models/user.model';
import {AuthService} from '../../../../../../services/auth/auth.service';
import {InnovCard} from '../../../../../../models/innov-card';
import {domainRegEx, emailRegEx} from '../../../../../../utils/regex';
import {Campaign} from '../../../../../../models/campaign';
import {CampaignService} from '../../../../../../services/campaign/campaign.service';
import {EmailScenario} from '../../../../../../models/email-scenario';
import {TagsService} from '../../../../../../services/tags/tags.service';
import {FrontendService} from '../../../../../../services/frontend/frontend.service';
import {EmailTemplate} from '../../../../../../models/email-template';
import {Mission, MissionType} from '../../../../../../models/mission';
import {ClientProject} from '../../../../../../models/client-project';
import {ClientProjectService} from '../../../../../../services/client-project/client-project.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MissionService} from '../../../../../../services/mission/mission.service';
import {Objective, ObjectivesPrincipal} from '../../../../../../models/static-data/missionObjectives';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import { ErrorFrontService } from "../../../../../../services/error/error-front.service";

// todo remove this

@Component({
  selector: 'app-admin-project-followed',
  templateUrl: './admin-project-management.component.html',
  styleUrls: ['./admin-project-management.component.scss']
})

/***
 * To do list for one project, show a list of tasks to perform for the project
 */
export class AdminProjectManagementComponent implements OnInit {

  private _project: Innovation;
  private _domain = {fr: '', en: ''};

  private _more: SidebarInterface = {
    animate_state: 'inactive'
  };
  sidebarState = new Subject<string>();
  projectSubject = new Subject<Innovation>();

  // Owner edition
  usersSuggestion: Array<any> = [];
  owner: any = {};
  displayUserSuggestion = false;

  // Domain edition
  projectDomains: Array<any> = [];

  // Operator edition
  operators: Array<User> = [];
  operatorId = '';

  // Innovation edition
  isInnovationSidebar = false;

  // Translate view
  innovCards: Array<InnovCard> = [];

  // Emails / Domains edition
  isEmailsDomainsSidebar = false;

  // Answer tags number
  answerTags = 0;

  // Campaign choice
  currentCampaign: any = null;

  // Campaign tags
  isTagsSidebar = false;

  // Workflows
  private _availableScenarios: Array<EmailScenario> = [];
  private _modifiedScenarios: Array<EmailScenario> = [];

  public formData: FormGroup = this._formBuilder.group({
    owner: '',
    mission: ''
  });

  public edit: {[k: string]: boolean} = {};

  private _clientProject: ClientProject = <ClientProject>{};

  private _mission: Mission = null;

  private _missionType: Array<string> = ['USER', 'CLIENT', 'DEMO', 'TEST'];

  private _currentLang = this._translateService.currentLang || 'en';

  private _missionObjectives: Array<Objective> = ObjectivesPrincipal;

  private _commercials: Observable<Array<User>> = this._userService
    .getAll({ roles: 'commercial', fields: '_id firstName lastName email phone', sort: '{"firstName": 1}'})
    .map((response: any) => response.result);

  public missionTeam: string[];

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _autoCompleteService: AutocompleteService,
              private _authService: AuthService,
              private _router: Router,
              private _userService: UserService,
              private _rolesFrontService: RolesFrontService,
              private _tagService: TagsService,
              private _notificationsService: TranslateNotificationsService,
              private _dashboardService: DashboardService,
              private _campaignService: CampaignService,
              private _translateService: TranslateService,
              private _formBuilder: FormBuilder,
              private _clientProjectService: ClientProjectService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _missionService: MissionService,
              private _frontendService: FrontendService) {}

  /***
   * On initialising, we load all the data we need by calling services
   */
  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];

    this._updateProject(this._project);

    this._dashboardService.getOperators().subscribe((operators: any) => this.operators = operators.result);

    this.operatorId = this._project && this._project.operator
      ? (this._project.operator.id ? this._project.operator.id : this._project.operator.toString())
      : undefined;

    this.isInnovationSidebar = false;

    this.isEmailsDomainsSidebar = false;

    this._tagService.getTagsFromPool(this._project._id).subscribe((data: any) => {
      this.answerTags = data.length;
    });

    this._innovationService.campaigns(this._project._id)
      .subscribe((campaigns: any) => {
          this.currentCampaign = this.getBestCampaign(campaigns.result);
          if (this.currentCampaign !== null) {
            this.generateAvailableScenario();
            this.generateModifiedScenarios();
          }
        },
        (error: HttpErrorResponse) => this._translateNotificationsService.error('ERROR.ERROR', error.error)
      );
  }



  _updateProject(innovation: Innovation) {
    this._project = innovation;
    if (this._project.clientProject) {
      this._clientProject = <ClientProject>this._project.clientProject;
    }

    if (this._project.mission) {
      this._mission = <Mission>this._project.mission;
      this.missionTeam = this._mission.team.map((user: User) => user.id);
    }

    this.projectDomains = [{name: 'umi'},
      {name: 'dynergie'},
      {name: 'novanexia'},
      {name: 'inomer'},
      {name: 'multivalente'},
      {name: 'salveo'},
      {name: 'schneider'},
      {name: 'bnpparibas'}];

    this._domain = this._project && this._project.settings && this._project.settings.domain ? this._project.settings.domain : '';

    this.innovCards = [];
    this._project.innovationCards.forEach(value => this.innovCards.push(new InnovCard(value)));
  }

  /***
   * This function is call to update the stats of the innovation
   * @param {Innovation} innovation
   */
  public updateStats() {
    if (this.canAccess(['edit', 'statistics'])) {
      this._innovationService.updateStats(this._project._id)
        .subscribe((project: any) => {
          this._project = project;
        }, (error: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
        });
    }
  }

  /***
   * This function is call when the user click on a toggle
   * Change the metadata corresponding to the task in the project and saves it
   * @param {string} level
   * @param {string} name
   * @param event
   */
  public setMetadata(level: 'preparation' | 'campaign' | 'delivery', name: string, event: any) {
    if (this._project._metadata && this._project._metadata[level][name] !== undefined) {
      this._project._metadata[level][name] = event.currentTarget.checked;
      this._frontendService.calculateInnovationMetadataPercentages(this._project, level);
      this.save('Successfully saved.', {_metadata: this._project._metadata});
    }
  }

  /***
   * Get the boolean value of a task
   * @param {string} level
   * @param {string} name
   * @returns {any}
   */
  public getMetadata(level: string, name: string) {
    return !!this._project._metadata && this._project._metadata[level][name];
  }

  /***
   * This function reset the data
   */
  resetData() {
    this.edit = {};
    this.formData.reset();
  }

  /***
   * Reset all the sidebars
   */
  resetAllSidebar() {
    this.isEmailsDomainsSidebar = false;
    this.isInnovationSidebar = false;
    this.isTagsSidebar = false;
  }

  /***
   * Change the boolean value of a sidebar to true
   * @param {string} name
   */
  changeSidebar(name: string) {
    this.resetAllSidebar();
    switch (name) {
      case('innovation-form'):
        this.isInnovationSidebar = true;
        break;
      case('blacklist-emails-domains'):
        this.isEmailsDomainsSidebar = true;
        break;
      case('tags-form') :
        this.isTagsSidebar = true;
        break;
      default:
        // NOOP
    }
  }

  public updateMissionTeam(selectedOperator: User) {
    if (this.canAccess(['edit', 'mission'])) {
      const operatorIndex = this._mission.team.findIndex((operator: User) => operator.id === selectedOperator['_id']);
      if (operatorIndex > -1) {
        this._mission.team.splice(operatorIndex, 1);
        this.missionTeam.splice(operatorIndex, 1);
      } else {
        selectedOperator.id = selectedOperator['_id'];
        this._mission.team.push(selectedOperator);
        this.missionTeam.push(selectedOperator['_id']);
      }
    }
  }

  /***
   * This function suggest users to the user when he wants to change the owner
   */
  onSuggestUsers() {
    this.formData.get('owner').valueChanges.pipe(distinctUntilChanged()).subscribe((input: any) => {
      this.displayUserSuggestion = true;
      this.usersSuggestion = [];
      this._autoCompleteService.get({query: input, type: 'users'}).subscribe((res: any) => {
        if (res.length === 0) {
          this.displayUserSuggestion = false;
        } else {
          res.forEach((items: any) => {
            const valueIndex = this.usersSuggestion.indexOf(items._id);
            if (valueIndex === -1) { // if not exist then push into the array.
              this.usersSuggestion.push({name: items.name, _id: items._id, email: items.email});
            }
          });
        }
      });
    });
  }

  /***
   * This function set the owner value
   * @param value
   */
  onValueSelect(value: any) {
    this.formData.get('owner').setValue(value.name);
    this.owner = value;
    this.displayUserSuggestion = false;
  }

  /***
   * This function is call when the user click on save
   * Change the owner of the project
   */
  ownerEditionFinished() {
    if (this.canAccess(['edit', 'owner'])) {
      this._project.owner = this.owner;
      this.save('Le propriétaire à été mis à jour avec succès !', {owner: this._project.owner});
      this._saveClientProject('OWNER');
      this.saveMission({client: this.owner._id});
    }
  }

  /***
   * This function is call when the user change the domain of the project
   * @param {string} value
   */
  changeProjectDomain(value: string) {
    if (this.canAccess(['edit', 'domain'])) {
      this._project.domain = value;
      this.save('le domaine a été mis à jour avec succès !', {domain: this._project.domain});
    }
  }

  /***
   * This function is call when the user change the operator of the project
   * @param value
   */
  changeProjectOperator(value: any) {
    if (this.canAccess(['edit', 'operator'])) {
      this._project.operator = value || null;
      this.operatorId = value || undefined;
      this.save('L\'opérateur à été mis à jour avec succès', {operator: this._project.operator});
    }
  }

  changeMissionType(type: MissionType) {
    if (this.canAccess(['edit', 'missionType'])) {
      this._mission.type = type;
      this.saveMission({type: this._mission.type});
    }
  }

  changeMissionObjective(objective: string) {
    if (this.canAccess(['edit', 'mainObjective'])) {
      const index = this._missionObjectives.findIndex((value) =>
        value[this._currentLang]['label'] === objective);

      if (index !== -1) {

        if (!this._mission.objective) {
          this._mission.objective = {
            principal: {},
            secondary: [],
            comment: ''
          };
        }

        this._mission.objective.principal = {
          en: this._missionObjectives[index].en.label,
          fr: this._missionObjectives[index].fr.label,
        };

        this.saveMission({objective: this._mission.objective});

      }
    }
  }

  changeCommercial(id: any) {
    if (this.canAccess(['edit', 'commercial'])) {
      this._clientProject.commercial = id;
      this._saveClientProject();
    }
  }

  /***
   * This function is call when the user edit the description of the project
   * Change the sidebar to the pitch sidebar
   */
  editProjectDescription() {
    this.changeSidebar('innovation-form');
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.PREPARATION.EDIT_DESCRIPTION',
      type: 'pitch',
      size: '726px'
    };
  }

  editRoadmap() {
    this.changeSidebar('mission-form');
    this._more = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.EDIT_MISSION',
      type: 'mission',
      size: '726px'
    };
  }

  /***
   * This function is call when the user edit the targeting of the project
   * Change the sidebar to the targeting sidebar
   */
  editProjectTargeting() {
    this.changeSidebar('innovation-form');
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.PREPARATION.EDIT_MARKET_TARGETING',
      type: 'targeting',
      size: '726px'
    };
  }

  /***
   * This function is call when the user save a modification on the project in a sidebar
   * Change the project value and saves it
   * @param {Innovation} value
   */
  changeProject(value: Innovation) {
    this._project.innovationCards = value.innovationCards;
    this._more = {animate_state: 'inactive', title: this._more.title, type: this._more.type};
    this.save('Le projet a bien été mise à jour !', {innovationCards: this._project.innovationCards});
    // window.location.reload();
  }

  /***
   * This function is call when the user edit the mails and domais to blacklist on the project
   * Change the sidebar to the excludeEmails sidebar
   */
  editBlacklist() {
    if (this.canAccess(['edit', 'blocklist'])) {
      this.changeSidebar('blacklist-emails-domains');
      this._more = {
        animate_state: 'active',
        title: 'Exclude E-mails / Domains',
        type: 'EXCLUDE_EMAILS_DOMAINS'
      };
    }
  }

  /***
   * This function is call when the user saves his modifications on the blacklist sidebar
   * Add mails and domains to blacklist
   * @param {Array<any>} values
   */
  addBlacklists(values: {emails: Array<string>, domains: Array<string>}) {
    if (values.emails.length > 0) {
      const domainExp = domainRegEx;
      const emailExp = emailRegEx;

      // We test if it's an array of domains or emails and we clean the corresponding array
      /*domainExp.test(values[0].text)
        ? this._project.settings.blacklist.domains = []
        : this._project.settings.blacklist.emails = [];*/

      if (values.domains.length) {
        this._project.settings.blacklist.domains = [];
        values.domains.forEach((value: any) => {
          if (domainExp.test(value.text)) {
            this._project.settings.blacklist.domains.push(value.text.split('@')[1]);
          }
        });
      }

      if (values.emails.length) {
        this._project.settings.blacklist.emails = [];
        // We insert all the domains or emails in the corresponding array
        values.emails.forEach((value: any) => {
          if (emailExp.test(value.text)) {
            this._project.settings.blacklist.emails.push(value.text);
          }
        });
      }

      this.save('Les emails / domaines ont bien été blacklistés', {settings: this._project.settings});
      this._more = {animate_state: 'inactive', title: this._more.title};
    }
  }

  /***
   * This function is call when the user edit the status of the project
   * Change the sidebar to the status sidebar
   */
  editStatus() {
    if (this.canAccess(['edit', 'status'])) {
      this.changeSidebar('innovation-form');
      this._more = {
        animate_state: 'active',
        title: 'PROJECT.PREPARATION.UPDATE_STATUS',
        type: 'status',
        size: '650px',
      };
    }
  }

  // Campaign section


  /***
   * This function returns the best campaign related to a project
   * @param {Campaign[]} campaigns
   * @returns {Campaign}
   */
  getBestCampaign(campaigns: Campaign[]): Campaign {
    if (campaigns.length > 0) {
      return campaigns.reduce((a, b) =>
        (a.stats ? a.stats.campaign.nbValidatedResp + a.stats.campaign.nbToValidateResp : 0)
        > (b.stats ? b.stats.campaign.nbValidatedResp + b.stats.campaign.nbToValidateResp : 0)
          ? a : b);
    } else {
      return null;
    }
  }

  /***
   * This function is call when the user edit the tags of the project
   * Change the sidebar to the addTags sidebar
   */
  editProjectTags() {
    if (this.canAccess(['edit', 'projectTags'])) {
      this.changeSidebar('tags-form');
      this._more = {
        animate_state: 'active',
        title: 'COMMON.ADD-TAGS',
        type: 'ADD_TAGS',
      };
    }
  }

  /***
   * This function is call when the user add tags to the project
   * @param {Tag[]} tags
   */
  addTags(tags: Tag[]) {
    this._project.tags = [];
    tags.forEach(tag => {
      if (!this._project.tags.find(value => value._id === tag._id)) {
        this._project.tags.push(tag);
      }
    });
    this.save('Les tags ont bien été mis à jour ', {tags: this._project.tags});
    this._more = {animate_state: 'inactive', title: this._more.title};
  }

  /***
   * This function is call when the user click on the button show
   * Go to the answer tags edition page
   */
  goToAnswerTagsEdition() {
    if (this.canAccess(['edit', 'answersTags'])) {
      this._router.navigate(['/user/admin/projects/project/' + this._project._id + '/answer_tags']);
    }
  }

  /***
   * This function is call when the user click on the button show
   * Go to the professional list page
   */
  goToProfessionalsList() {
    this._router.navigate(['/user/admin/campaigns/campaign/' + this.currentCampaign._id + '/pros']);
  }

  /***
   * This function is call when the user click on the button show
   * Go to the templates edition page
   */
  goToTemplates() {
    this._router.navigate(['/user/admin/campaigns/campaign/' + this.currentCampaign._id + '/templates']);
  }

  /***
   * This function is call when the user click on the button show
   * Go to the autobatch page
   */
  goToAutoBatch() {
    this._router.navigate(['/user/admin/campaigns/campaign/' + this.currentCampaign._id + '/mails']);
  }

  /***
   * This function is call when the user click on the button show
   * Go to the answers edition page
   */
  goToInsights() {
    this._router.navigate(['/user/admin/campaigns/campaign/' + this.currentCampaign._id + '/answers']);
  }

  /***
   * This function get the available scenarios of the campaign
   */
  private generateAvailableScenario() {
    this._availableScenarios = [];
    let scenariosnames: Set<string>;
    scenariosnames = new Set<string>();
    if (this.currentCampaign.settings && this.currentCampaign.settings.emails) {
      this.currentCampaign.settings.emails.forEach((x: EmailTemplate) => {
        scenariosnames.add(x.nameWorkflow);
      });
    }
    scenariosnames.forEach((name) => {
      const scenar = {} as EmailScenario;
      scenar.name = name;
      scenar.emails = this.currentCampaign.settings.emails.filter((email: EmailTemplate) => {
        return email.nameWorkflow === name;
      });
      this._availableScenarios.push(scenar);
    });
  }

  /***
   * This function get the available scenarios that have been fully modified
   */
  public generateModifiedScenarios() {
    this._modifiedScenarios = this.availableScenarios.filter((x) => {
      return x.emails.reduce((acc, current) => {
        return (acc && current.modified);
      }, true);
    });
  }

  /***
   * This function update the default scenarios
   * @requires at least one modify scenario
   * @param {string} workflowName
   */
  updateDefaultWorkflow(workflowName: string) {
    this.currentCampaign.settings.defaultWorkflow = workflowName;
    this.saveCampaign('Le workflow par défaut a bien été mis à jour');
  }

  /// Delivery section

  /***
   * change the visibility of the project
   */
  changeExternalDiffusion() {
    this._project.isPublic = !this._project.isPublic;
    this.save('La visibilité du projet a été mise à jour !', {isPublic: this._project.isPublic});
  }

  /***
   * This function is call when the user click on the button show
   * Go to the synthesis page
   */
  goToSynthesis() {
    this._router.navigate(['/user/admin/projects/project/' + this._project._id + '/synthesis']);
  }

  /***
   * This function is call when the user wants to write the ending mail of the project
   * Change the sidebar to the send-ending-mail sidebar
   */
  editEndingMail() {
    this.changeSidebar('innovation-form');
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.DELIVERY.WRITE_ENDING_MAIL',
      type: 'send-ending-mail',
      size: '650px',
    };
  }

  /***
   * This function is call when the user wants to edit the client satisfaction for the project
   * Change the sidebar to the satisfaction sidebar
   */
  editClientSatisfaction() {
    this.changeSidebar('innovation-form');
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.DELIVERY.CLIENT_SATISFACTION',
      type: 'satisfaction',
    };
  }

  /***
   * This function is call when the user wants to edit the project feedback
   * Change the sidebar to the feedback sidebar
   */
  editFeedback() {
    this.changeSidebar('innovation-form');
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.DELIVERY.OPERATOR_FEEDBACK',
      type: 'feedback',
    };
  }

  /***
   * This function is call when the user wants to save the project
   * @param {string} notification
   */
  public save(notification: string, saveObject: any): void {
    this._innovationService
      .save(this._project._id, saveObject)
      .subscribe((data: any) => {
        this._project = data;
        this.resetData();
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE' , notification);
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      });
  }

  private _saveClientProject(type?: string) {
    if (this._clientProject._id) {

      if (type === 'OWNER') {
        this._clientProject.client = this.owner._id;
      }

      this._clientProjectService.save(this._clientProject._id, this._clientProject).pipe(first()).subscribe((clientProject) => {
        this._clientProject = clientProject;
        this._notificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this._notificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      });

    }
  }

  public saveMissionTeam() {
    this.edit.missionTeam = false;
    this.saveMission({team: this._mission.team});
  }

  private saveMission(missionObj: { [P in keyof Mission]?: Mission[P]; }) {
    if (this._mission._id) {

      this._missionService.save(this._mission._id, missionObj).pipe(first()).subscribe((mission) => {
        this._notificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this._notificationsService.error('ERROR.ERROR', err.message);
      });

    }
  }

  /***
   * This function is call when the user wants to save a campaign
   * @param {string} notification
   */
  public saveCampaign(notification: string): void {
    this._campaignService.put(this.currentCampaign).subscribe((savedCampaign: any) => {
      this._notificationsService.success('ERROR.ACCOUNT.UPDATE', notification);
      this.currentCampaign = savedCampaign;
      this.resetData();
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
    });
  }

  public hasBeenPublished(): boolean {
    return !!this._project['published'];
  }

  public publishedNote(): string {
    return this.hasBeenPublished() ? `Published on ${this._project['published']}` : 'Not yet published';
  }

  public publish() {
    /*this._innovationService.publishToCommunity(this._project._id).subscribe(published => {
      if (published) {
        this._project['published'] = published;
      } else {
        this._project['published'] = null;
      }
    }, err => {
      this._project['published'] = null;
      this._notificationsService.error('Error', 'Cannot publish the innovation at this time!');
    });*/
  }

  public getRate(value1: number, value2: number, decimals?: number): string {
    const power = decimals ? Math.pow(10, decimals) : 100;
    if (value2 && (value1 || value1 === 0)) {
      return (Math.round(100 * power * value1 / value2) / power).toString() + '%';
    }
    return '?';
  }

  /***
   * This function is call when the user close the sidebar
   * @param {string} value
   */
  /*closeSidebar(value: string) {
    console.log(value);
    this.more.animate_state = value;
    this.sidebarState.next(this.more.animate_state);
    this.projectSubject.next(this._project);
  }*/

  public updateOwnerLanguage(language: string) {
    this._project.owner.language = language;
    this._userService.updateOther(this._project.owner).subscribe();
  }

  public onValidateProject(event: Event) {
    event.preventDefault();
    if (this.canAccess(['edit', 'validateProject']) && this._project.status === 'SUBMITTED') {
      this._project.status = 'EVALUATING';
      this.save('The project has been validated successfully', {status: this._project.status});
      if (this._mission && this._mission._id && this._mission.type === 'USER') {
        this._mission.type = 'CLIENT';
        this.saveMission({type: this._mission.type});
      }
    }
  }

  public onRevisionProject(event: Event) {
    event.preventDefault();
    if (this._project.status === 'SUBMITTED' && this.canAccess(['edit', 'projectRevision'])) {
      this._project.status = 'EDITING';
      this.save('The project has been placed in revision status, please notify the owner of the changes to be made.',
        {status: this._project.status});
    }
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'settings'].concat(path));
  }

  formatText(text: string) {
    return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  set domain(domain: {en: string, fr: string}) { this._domain = domain; }


  get domain() {
    return this._domain;
  }

  get project() {
    return this._project;
  }

  get availableScenarios(): Array<EmailScenario> { return this._availableScenarios; }

  get modifiedScenarios(): Array<EmailScenario> { return this._modifiedScenarios; }

  get more() {
    return this._more;
  }

  get authService() {
    return this._authService;
  }

  get tagTypes(): string {
    return JSON.stringify(['SECTOR', 'QUALIFICATION']);
  }

  get mission(): Mission {
    return this._mission;
  }

  set mission(value: Mission) {
    this._mission = value;
  }

  get missionType(): Array<string> {
    return this._missionType;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get missionObjectives(): Array<Objective> {
    return this._missionObjectives;
  }

  get commercials(): Observable<Array<User>> {
    return this._commercials;
  }
  get clientProject(): ClientProject {
    return this._clientProject;
  }

  set more(value: SidebarInterface) {
    this._more = value;
    if (value.animate_state === 'inactive') {
      this.sidebarState.next(this._more.animate_state);
      this.projectSubject.next(this._project);
    }
  }

}
