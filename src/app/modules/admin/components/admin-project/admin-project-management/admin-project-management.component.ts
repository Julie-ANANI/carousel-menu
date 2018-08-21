import { Component, OnInit } from '@angular/core';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Tag} from '../../../../../models/tag';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';
import {Innovation} from '../../../../../models/innovation';
import {Preset} from '../../../../../models/preset';
import {ActivatedRoute, Router} from '@angular/router';
import {Template} from '../../../../sidebar/interfaces/template';
import {Subject} from 'rxjs/Subject';
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

@Component({
  selector: 'app-admin-project-followed',
  templateUrl: './admin-project-management.component.html',
  styleUrls: ['./admin-project-management.component.scss']
})
export class AdminProjectManagementComponent implements OnInit {


  private _project: Innovation;
  private _dirty = false;
  private _domain = {fr: '', en: ''};
  private _editInstanceDomain = false;

  private _more: Template = {};
  sidebarState = new Subject<string>();
  projectSubject = new Subject<Innovation>();

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
  currentCampaign: Campaign = null;

  // Campaign tags
  isTagsSidebar = false;

  // Workflows
  private _availableScenarios: Array<EmailScenario> = [];
  private _modifiedScenarios: Array<EmailScenario> = [];

  private _config = {
    search: {},
    sort: {
      created: -1
    }
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
              private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];

    this.projectDomains = [{name: 'umi'}, {name: 'dynergie'}, {name: 'novanexia'}, {name: 'inomer'}, {name: 'multivalente'}];

    this._domain = this._project.settings.domain;

    this.offers = [{name: 'insights', alias: 'GetInsights'}, {name: 'apps', alias: 'GetApps'}, {name: 'leads', alias: 'GetLeads'}];

    this._dashboardService.getOperators().first().subscribe((operators) => this.operators = operators.result);

    this.operatorId = this._project.operator
      ? (this._project.operator.id ? this._project.operator.id : this._project.operator.toString())
      : undefined;

    this._presetService.getAll(this._config)
      .first()
      .subscribe(p => {
        this.presets = p.result;
      });

    this._project.innovationCards.forEach(value => this.innovCards.push(new InnovCard(value)));

    this.isInnovationSidebar = false;

    this.isEmailsDomainsSidebar = false;

    this._tagService.getTagsFromPool(this.project._id).subscribe((data) => {
      this.answerTags = data.length;
    });

    this._innovationService.campaigns(this._project._id)
      .first()
      .subscribe(campaigns => {
          this.currentCampaign = this.getBestCampaign(campaigns.result);
          if (this.currentCampaign !== null) {
            this.updateStats(event, this.currentCampaign);
            this.generateAvailableScenario();
            this.generateModifiedScenarios();
          }
        },
        error => this._notificationsService.error('ERROR', error.message)
      );
  }

  public setMetadata(level: string, name: string, event: any) {
    if (this._project._metadata && this._project._metadata[level][name] !== undefined) {
      this._project._metadata[level][name] = event.currentTarget.checked;
      this.save(event, 'Successfully saved.');
    }
  }

  public getMetadata(level: string, name: string) {
    return !!this._project._metadata && this._project._metadata[level][name];
  }

  resetData() {
    this._dirty = false;
    this.isEditOwner = false;
    this.formData.reset();
  }

  resetAllSidebar() {
    this.isEmailsDomainsSidebar = false;
    this.isInnovationSidebar = false;
    this.isTagsSidebar = false;
  }

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

  onSuggestUsers() {
    this.formData.get('owner').valueChanges.distinctUntilChanged().subscribe(input => {
      this.displayUserSuggestion = true;
      this.usersSuggestion = [];
      this._autoCompleteService.get({keyword: input, type: 'users'}).subscribe(res => {
        if (res.length === 0) {
          this.displayUserSuggestion = false;
        } else {
          res.forEach((items) => {
            const valueIndex = this.usersSuggestion.indexOf(items._id);
            if (valueIndex === -1) { // if not exist then push into the array.
              this.usersSuggestion.push({name: items.name, _id: items._id});
            }
          })
        }
      });
    });
  }

  onValueSelect(value: any) {
    this.formData.get('owner').setValue(value.name);
    this.owner = value;
    this.displayUserSuggestion = false;
  }

  ownerEditionFinished() {
    this._project.owner = this.owner;
    this.save(event, 'Le propriétaire à été mis à jour avec succès !');
  }

  changeProjectDomain(value: string) {
    this._project.domain = value;
    this.save(event, 'le domaine a été mis à jour avec succès !');
  }

  changeProjectOperator(value: any) {
    this._project.operator = value || null;
    this.operatorId = value || undefined;
    this.save(event, 'L\'opérateur à été mis à jour avec succès');
  }

  changeProjectOffer(value: any) {
    this._project.type = value;
    this.save(event, 'L\'offre à été mise à jour avec succès');
  }

  public updatePreset(presetName: string): void {
    let preset: any = {sections: []};
    if (presetName) {
      preset = this.presets.find(value => value.name === presetName);
      this._innovationService.updatePreset(this._project._id, preset).first().subscribe(data => {
        this._activatedRoute.snapshot.parent.data['innovation'] = data;
        this._project = data;
        this.save(event, 'Le questionnaire a bien été affecté au projet');
      }, (err) => {
        this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
    } else {
      this.project.preset = preset;
      this.save(event, 'Il n\'existe plus de questionnaire correspondant à ce projet');
    }
  }

  goToPresetEdition() {
    this._router.navigate(['/admin/projects/project/' + this._project._id + '/questionnaire']);
  }

  editProjectDescription() {
    this.changeSidebar('innovation-form');
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.PREPARATION.EDIT_DESCRIPTION',
      type: 'pitch',
      size: '726px'
    };
  }

  editProjectTargeting() {
    this.changeSidebar('innovation-form');
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.PREPARATION.EDIT_MARKET_TARGETING',
      type: 'targeting',
      size: '726px'
    };
  }

  changeProject(value: Innovation) {
    this._project = value;
    this.save(event, 'Le projet a bien été mise à jour !');
    this._more = {animate_state: 'inactive', title: this._more.title};
  }

  editBlacklist() {
    this.changeSidebar('blacklist-emails-domains');
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.PREPARATION.EDIT_MARKET_TARGETING',
      type: 'excludeEmails',
    };
  }

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
      this.save(event, 'Les emails / domaines ont bien été blaklistés');
      this._more = {animate_state: 'inactive', title: this._more.title};
    }
  }

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

  public updateStats(event: Event, campaign: Campaign) {
    event.preventDefault();
    this._campaignService.updateStats(campaign._id)
      .first()
      .subscribe(stats => {
        campaign.stats = stats;
      }, error => {
        this._notificationsService.error('ERROR', error.message);
      });
  };

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

  editProjectTags() {
    this.changeSidebar('tags-form');
    this._more = {
      animate_state: 'active',
      title: 'COMMON.ADD-TAGS',
      type: 'addTags',
    };
  }

  addTags(tags: Tag[]) {
    this._project.tags = [];
    tags.forEach(tag => {
      if (!this._project.tags.find(value => {return value._id === tag._id})) {
        this._project.tags.push(tag);
      };
    });
    this.save(event, 'Les tags ont bien été mis à jour ');
    this._more = {animate_state: 'inactive', title: this._more.title};
  }

  goToAnswerTagsEdition() {
    this._router.navigate(['/admin/projects/project/' + this._project._id + '/answer_tags']);
  }

  goToProfessionalsList() {
    this._router.navigate(['/admin/campaigns/campaign/' + this.currentCampaign._id + '/pros']);
  }

  goToTemplates() {
    this._router.navigate(['/admin/campaigns/campaign/' + this.currentCampaign._id + '/templates']);
  }

  goToAutoBatch() {
    this._router.navigate(['/admin/campaigns/campaign/' + this.currentCampaign._id + '/mails']);
  }

  goToInsights() {
    this._router.navigate(['/admin/campaigns/campaign/' + this.currentCampaign._id + '/answers']);
  }

  private generateAvailableScenario() {
    this._availableScenarios = [];
    let scenariosnames: Set<string>;
    scenariosnames = new Set<string>();
    if (this.currentCampaign.settings && this.currentCampaign.settings.emails) {
      this.currentCampaign.settings.emails.forEach((x) => {
        scenariosnames.add(x.nameWorkflow);
      });
    }
    scenariosnames.forEach((name) => {
      const scenar = {} as EmailScenario;
      scenar.name = name;
      scenar.emails = this.currentCampaign.settings.emails.filter(email => {
        return email.nameWorkflow === name;
      });
      this._availableScenarios.push(scenar);
    });
  }

  public generateModifiedScenarios() {
    this._modifiedScenarios = this.availableScenarios.filter((x) => {
      return x.emails.reduce((acc, current) => {
        return (acc && current.modified);
      }, true);
    });
  }

  updateDefaultWorkflow(workflowName: string) {
    this.currentCampaign.settings.defaultWorkflow = workflowName;
    this.saveCampaign(event, 'Le workflow par défaut a bien été mis à jour');
  }

  /// Delivery section

  changeExternalDiffusion() {
    this._project.isPublic = !this._project.isPublic;
    this.save(event, 'La visibilité du projet a été mise à jour !');
  }

  goToSynthesis() {
    this._router.navigate(['/admin/projects/project/' + this._project._id + '/synthesis']);
  }

  /**
   * Sauvegarde du projet
   */
  public save(event: Event, notification: string): void {
    event.preventDefault();
    this._innovationService
      .save(this._project._id, this._project)
      .first()
      .subscribe(data => {
        this._project.__v = data.__v;
        this.resetData();
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE' , notification);
      }, err => {
        this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
  }

  public saveCampaign(event: Event, notification: string): void {
    event.preventDefault();
    this._campaignService.put(this.currentCampaign).first().subscribe(savedCampaign => {
      this._notificationsService.success('ERROR.ACCOUNT.UPDATE', notification);
      this.currentCampaign = savedCampaign;
      this.resetData();
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }


  /**
   * Suppression et mise à jour de la vue
   */
  /*public removeProject(projectId: string) {
    this._innovationService
      .remove(projectId)
      .subscribe(projectRemoved => {
        this._projects.splice(this._getProjectIndex(projectId), 1);
        this.selectedProjectIdToBeDeleted = null;
      });
  }*/

  public hasPreset(): boolean {
    const p = this._project.preset;

    return (p && p.sections && p.constructor === Object && Object.keys(p.sections).length > 0);
  }

  formatText(text: string) {
    return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }



  public updateDomain() {
    this._innovationService.updateSettingsDomain(this._project._id, this._domain).first().subscribe( x => {
      this._domain = x.domain;
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    }, (error) => {
      this._notificationsService.error('ERROR', error);
    });
  }

  closeSidebar(value: string) {
    this.more.animate_state = value;
    this.sidebarState.next(this.more.animate_state);
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
    this.projectSubject.next(this._project);
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

  get dirty() {
    return this._dirty;
  }

  get editInstanceDomain(): boolean {
    return this._editInstanceDomain;
  }

}


/*
seeDomain
seeOperator
editOwner

 */
