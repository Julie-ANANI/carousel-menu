import {Component, OnInit} from '@angular/core';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Tag} from '../../../../../models/tag';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';
import {Innovation} from '../../../../../models/innovation';
import {Preset} from '../../../../../models/preset';
import {ActivatedRoute, Router} from '@angular/router';
import {Template} from '../../../../sidebar/interfaces/template';
import {Subject} from 'rxjs';
import { first, distinctUntilChanged } from 'rxjs/operators';
import {AutocompleteService} from '../../../../../services/autocomplete/autocomplete.service';
import {DashboardService} from '../../../../../services/dashboard/dashboard.service';
import {User} from '../../../../../models/user.model';
import {AuthService} from '../../../../../services/auth/auth.service';
import {PresetService} from '../../../../../services/preset/preset.service';
import {InnovCard} from '../../../../../models/innov-card';
import {domainRegEx, emailRegEx} from '../../../../../utils/regex';
import {Campaign} from '../../../../../models/campaign';
import {CampaignService} from '../../../../../services/campaign/campaign.service';
import {EmailScenario} from '../../../../../models/email-scenario';
import {TagsService} from '../../../../../services/tags/tags.service';
import {FrontendService} from '../../../../../services/frontend/frontend.service';
import {EmailTemplate} from '../../../../../models/email-template';

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

  private _more: Template = {};
  sidebarState = new Subject<string>();
  projectSubject = new Subject<Innovation>();

  private _showDeleteModal = false;

  // Owner edition
  isEditOwner = false;
  usersSuggestion: Array<any> = [];
  owner: any = {};
  displayUserSuggestion = false;

  // Domain edition
  projectDomains: Array<any> = [];

  // Operator edition
  operators: Array<User> = [];
  operatorId = '';

  // Offer edition
  offers: Array<any> = [];

  // Preset edition
  presets: Array<Preset> = [];

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

  // Click percentage
  private _clickPercentage = 0.0;

  // Campaign tags
  isTagsSidebar = false;

  // Workflows
  private _availableScenarios: Array<EmailScenario> = [];
  private _modifiedScenarios: Array<EmailScenario> = [];

  private _config = {
    search: '{}',
    sort: '{"created":-1}'
  };

  public formData: FormGroup = this._formBuilder.group({
    domainen: ['', [Validators.required]],
    domainfr: ['', [Validators.required]],
    owner: '',
  });

  public presetAutocomplete: any;

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _autoCompleteService: AutocompleteService,
              private _authService: AuthService,
              private _router: Router,
              private _presetService: PresetService,
              private _tagService: TagsService,
              private _notificationsService: TranslateNotificationsService,
              private _dashboardService: DashboardService,
              private _campaignService: CampaignService,
              private _translateService: TranslateService,
              private _formBuilder: FormBuilder,
              private _frontendService: FrontendService) {}

  /***
   * On initialising, we load all the data we need by calling services
   */
  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];

    this.projectDomains = [{name: 'umi'}, {name: 'dynergie'}, {name: 'novanexia'}, {name: 'inomer'}, {name: 'multivalente'}];

    this._domain = this._project.settings.domain;

    this.offers = [{name: 'insights', alias: 'GetInsights'}, {name: 'apps', alias: 'GetApps'}, {name: 'leads', alias: 'GetLeads'}];

    this._dashboardService.getOperators().pipe(first()).subscribe((operators: any) => this.operators = operators.result);

    this.operatorId = this._project.operator
      ? (this._project.operator.id ? this._project.operator.id : this._project.operator.toString())
      : undefined;

    this._presetService.getAll(this._config)
      .pipe(first())
      .subscribe((p: any) => {
        this.presets = p.result;
      });

    this._project.innovationCards.forEach(value => this.innovCards.push(new InnovCard(value)));

    this.isInnovationSidebar = false;

    this.isEmailsDomainsSidebar = false;

    this._tagService.getTagsFromPool(this.project._id).subscribe((data: any) => {
      this.answerTags = data.length;
    });

    this._innovationService.campaigns(this._project._id)
      .subscribe((campaigns: any) => {
          this.currentCampaign = this.getBestCampaign(campaigns.result);
          if (this.currentCampaign !== null) {
            this.calculateClickPercentage();
            this.updateStats(this.currentCampaign);
            this.generateAvailableScenario();
            this.generateModifiedScenarios();
          }
        },
        (error: any) => this._notificationsService.error('ERROR', error.message)
      );
  }

  /***
   * This function is call when the user click on a toggle
   * Change the metadata corresponding to the task in the project and saves it
   * @param {string} level
   * @param {string} name
   * @param event
   */
  public setMetadata(level: string, name: string, event: any) {
    if (this._project._metadata && this._project._metadata[level][name] !== undefined) {
      this._project._metadata[level][name] = event.currentTarget.checked;
      this._frontendService.calculateInnovationMetadataPercentages(this._project, level);
      this.save('Successfully saved.');
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
    this.isEditOwner = false;
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
      case('innovation-form') : {
        this.isInnovationSidebar = true;
        break;
      } case('blacklist-emails-domains'): {
        this.isEmailsDomainsSidebar = true;
        break;
      } case('tags-form') : {
        this.isTagsSidebar = true;
        break;
      } default : {
        break;
      }
    }
  }

  // Preparation section

  editOwner() {
    this.isEditOwner = true;
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
              this.usersSuggestion.push({name: items.name, _id: items._id});
            }
          })
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
    this._project.owner = this.owner;
    this.save('Le propriétaire à été mis à jour avec succès !');
  }

  /***
   * This function is call when the user change the domain of the project
   * @param {string} value
   */
  changeProjectDomain(value: string) {
    this._project.domain = value;
    this.save('le domaine a été mis à jour avec succès !');
  }

  /***
   * This function is call when the user change the operator of the project
   * @param value
   */
  changeProjectOperator(value: any) {
    this._project.operator = value || null;
    this.operatorId = value || undefined;
    this.save('L\'opérateur à été mis à jour avec succès');
  }

  /***
   * This function is call when the user change the offer of the project
   * @param value
   */
  changeProjectOffer(value: any) {
    this._project.type = value;
    this.save('L\'offre à été mise à jour avec succès');
  }

  /***
   * This function is call when the user change the preset of the project
   * @param {string} presetName
   */
  public updatePreset(presetName: string): void {
    let preset: any = {sections: []};
    if (presetName) {
      preset = this.presets.find(value => value.name === presetName);
      this._innovationService.updatePreset(this._project._id, preset).pipe(first()).subscribe((data: any) => {
        this._activatedRoute.snapshot.parent.data['innovation'] = data;
        this._project = data;
        this.save('Le questionnaire a bien été affecté au projet');
      }, (err: any) => {
        this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
    } else {
      this.project.preset = preset;
      this.save('Il n\'existe plus de questionnaire correspondant à ce projet');
    }
  }

  /***
   * This function check if a project has a preset
   * @returns {boolean}
   */
  public hasPreset(): boolean {
    const p = this._project.preset;

    return (p && p.sections && p.constructor === Object && Object.keys(p.sections).length > 0);
  }

  /***
   * This function is call when the user click on the button show
   * Go to the preset edition page
   */
  goToPresetEdition() {
    this._router.navigate(['/admin/projects/project/' + this._project._id + '/questionnaire']);
  }

  /***
   * This function generates the quiz for the project.
   */
  generateQuiz(event: Event) {
    event.preventDefault();
    this._innovationService.createQuiz(this._project._id).pipe(first()).subscribe((result: any) => {
      this._project = result;
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.QUIZ.CREATED');
    }, (err: any) => {
      this._notificationsService.error('ERROR.ERROR', err);
    })
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
    this._project = value;
    console.log(this._project);
    this._more = {animate_state: 'inactive', title: this._more.title, type: this._more.type};
    this.save('Le projet a bien été mise à jour !');
    // window.location.reload();
  }

  /***
   *
   * @param mail
   */
  sendMailToOwner(mail: any) {
    this._innovationService.sendMailToOwner(this._project._id, mail).pipe(first()).subscribe((answer: any) => {
      console.log(answer);
    });
  }

  /***
   * This function is call when the user edit the mails and domais to blacklist on the project
   * Change the sidebar to the excludeEmails sidebar
   */
  editBlacklist() {
    this.changeSidebar('blacklist-emails-domains');
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.PREPARATION.EDIT_MARKET_TARGETING',
      type: 'excludeEmails',
    };
  }

  /***
   * This function is call when the user saves his modifications on the blacklist sidebar
   * Add mails and domains to blacklist
   * @param {Array<any>} values
   */
  addBlacklists(values: Array<any>) {
    if (values.length > 0) {
      const domainExp = domainRegEx;
      const emailExp = emailRegEx;

      // We test if it's an array of domains or emails and we clean the corresponding array
      domainExp.test(values[0].text)
        ? this._project.settings.blacklist.domains = []
        : this._project.settings.blacklist.emails = [];

      // We insert all the domains or emails in the corresponding array
      values.forEach((value: any) => {
        if (domainExp.test(value.text)) {
          this._project.settings.blacklist.domains.push(value.text.split('@')[1]);
        } else if (emailExp.test(value.text)) {
          this._project.settings.blacklist.emails.push(value.text);
        }
      });
      this.save('Les emails / domaines ont bien été blaklistés');
      this._more = {animate_state: 'inactive', title: this._more.title};
    }
  }

  /***
   * This function is call when the user edit the status of the project
   * Change the sidebar to the status sidebar
   */
  editStatus() {
    this.changeSidebar('innovation-form');
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.PREPARATION.UPDATE_STATUS',
      type: 'status',
      size: '650px',
    };
  }

  // Campaign section

  /***
   * This function is call to update the stats of a campaign
   * @param {Event} event
   * @param {Campaign} campaign
   */
  public updateStats(campaign: Campaign) {
    this._campaignService.updateStats(campaign._id)
      .pipe(first())
      .subscribe((stats: any) => {
        campaign.stats = stats;
      }, (error: any) => {
        this._notificationsService.error('ERROR', error.message);
      });
  };

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
   * This function calculate the click percentage to the project
   */
  calculateClickPercentage() {
    if (this.currentCampaign && this.currentCampaign.stats && this.currentCampaign.stats.campaign) {
      this._clickPercentage = this._frontendService.analyticPercentage(this.currentCampaign.stats.nbProsClicked,
        this.currentCampaign.stats.nbProsOpened);
    }
  }

  /***
   * This function is call when the user edit the tags of the project
   * Change the sidebar to the addTags sidebar
   */
  editProjectTags() {
    this.changeSidebar('tags-form');
    this._more = {
      animate_state: 'active',
      title: 'COMMON.ADD-TAGS',
      type: 'addTags',
    };
  }

  /***
   * This function is call when the user add tags to the project
   * @param {Tag[]} tags
   */
  addTags(tags: Tag[]) {
    this._project.tags = [];
    tags.forEach(tag => {
      if (!this._project.tags.find(value => { return value._id === tag._id })) {
        this._project.tags.push(tag);
      }
    });
    this.save('Les tags ont bien été mis à jour ');
    this._more = {animate_state: 'inactive', title: this._more.title};
  }

  /***
   * This function is call when the user click on the button show
   * Go to the answer tags edition page
   */
  goToAnswerTagsEdition() {
    this._router.navigate(['/admin/projects/project/' + this._project._id + '/answer_tags']);
  }

  /***
   * This function is call when the user click on the button show
   * Go to the professional list page
   */
  goToProfessionalsList() {
    this._router.navigate(['/admin/campaigns/campaign/' + this.currentCampaign._id + '/pros']);
  }

  /***
   * This function is call when the user click on the button show
   * Go to the templates edition page
   */
  goToTemplates() {
    this._router.navigate(['/admin/campaigns/campaign/' + this.currentCampaign._id + '/templates']);
  }

  /***
   * This function is call when the user click on the button show
   * Go to the autobatch page
   */
  goToAutoBatch() {
    this._router.navigate(['/admin/campaigns/campaign/' + this.currentCampaign._id + '/mails']);
  }

  /***
   * This function is call when the user click on the button show
   * Go to the answers edition page
   */
  goToInsights() {
    this._router.navigate(['/admin/campaigns/campaign/' + this.currentCampaign._id + '/answers']);
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
    this.save('La visibilité du projet a été mise à jour !');
  }

  /***
   * This function is call when the user click on the button show
   * Go to the synthesis page
   */
  goToSynthesis() {
    this._router.navigate(['/admin/projects/project/' + this._project._id + '/synthesis']);
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
  public save(notification: string): void {
    this._innovationService
      .save(this._project._id, this._project)
      .subscribe((data: any) => {
        this._project = data;
        this.resetData();
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE' , notification);
      }, (err: any) => {
        this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
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
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }

  /***
   * This function is call when the user close the sidebar
   * @param {string} value
   */
  closeSidebar(value: string) {
    this.more.animate_state = value;
    this.sidebarState.next(this.more.animate_state);
    this.projectSubject.next(this._project);
  }

  deleteProjectModal() {
    this._showDeleteModal = true;
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._showDeleteModal = false;
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removeProject() {
    this._innovationService
      .remove(this._project._id)
      .subscribe((projectRemoved: any) => {
        this._router.navigate(['/admin/projects/']);
      });
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

  get availableScenarios(): Array<EmailScenario> { return this._availableScenarios };

  get modifiedScenarios(): Array<EmailScenario> { return this._modifiedScenarios };

  get more() {
    return this._more;
  }

  get authService() {
    return this._authService;
  }

  get clickPercentage(): number {
    return this._clickPercentage;
  }

  get showDeleteModal(): boolean {
    return this._showDeleteModal;
  }

}
