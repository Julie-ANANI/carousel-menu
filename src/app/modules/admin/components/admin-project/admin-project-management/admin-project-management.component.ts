import { Component, OnInit } from '@angular/core';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Tag} from '../../../../../models/tag';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';
import {Innovation} from '../../../../../models/innovation';
import {InnovationSettings} from '../../../../../models/innov-settings';
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

  private _updateInstanceDomainConfig: {
    placeholder: string,
    initialData: Array<string>,
    type: string,
    identifier: string,
    canOrder: boolean
  } = {
    placeholder: 'Partners domain list',
    initialData: [],
    type: 'domain',
    identifier: 'name',
    canOrder: false
  };

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
              private _notificationsService: TranslateNotificationsService,
              private _dashboardService: DashboardService,
              private _translateService: TranslateService,
              private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];

    this.projectDomains = [{name: 'umi'}, {name: 'dynergie'}, {name: 'novanexia'}, {name: 'inomer'}, {name: 'multivalente'}];

    this._domain = this._project.settings.domain;

    this.offers = [{name: 'insights', alias: 'GetInsights'}, {name: 'apps', alias: 'GetApps'}, {name: 'leads', alias: 'GetLeads'}];

    this._dashboardService.getOperators().first().subscribe((operators) => this.operators = operators.result);

    this.operatorId = this._project.operator ? this._project.operator.toString() : '';

    this._presetService.getAll(this._config)
      .first()
      .subscribe(p => {
        this.presets = p.result;
      });

    this._project.innovationCards.forEach(value => this.innovCards.push(new InnovCard(value)));

    this.isInnovationSidebar = false;

    this.isEmailsDomainsSidebar = false;
  }

  resetData() {
    this._dirty = false;
    this.isEditOwner = false;
    this.formData.reset();
  }

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
    this._project.operator = value || undefined;
    this.operatorId = value || '';
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
    this.isEmailsDomainsSidebar = false;
    this.isInnovationSidebar = true;
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.PREPARATION.EDIT_DESCRIPTION',
      type: 'pitch',
      size: '726px'
    };
  }

  editProjectTargeting() {
    this.isEmailsDomainsSidebar = false;
    this.isInnovationSidebar = true;
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
    this.isEmailsDomainsSidebar = true;
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
    this.isEmailsDomainsSidebar = false;
    this.isInnovationSidebar = true;
    this._more = {
      animate_state: 'active',
      title: 'PROJECT.PREPARATION.UPDATE_STATUS',
      type: 'status',
      size: '650px',
    };
  }

  public addTag(tag: Tag): void {
    this._innovationService
      .addTag(this._project._id, tag._id)
      .first()
      .subscribe((p) => {
        this._project.tags.push(tag);
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
      });
  }

  public removeTag(tag: Tag): void {
    this._innovationService
      .removeTag(this._project._id, tag._id)
      .first()
      .subscribe((p) => {
        this._project.tags = this._project.tags.filter(t => t._id !== tag._id);
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
      });
  }

  public startEditInstanceDomain(event: Event): void {
    this._editInstanceDomain = true;
  }

  public endEditInstanceDomain(event: {value: Array<{name: string}>}): void {
    this._editInstanceDomain = false;
    this._project.domain = event.value[0].name || 'umi';
    this._dirty = true;
  }

  public buildInstanceDomainListConfig( initialData: Array<any>): any {
    this._updateInstanceDomainConfig.initialData = initialData || [];
    return this._updateInstanceDomainConfig;
  }

  public updateInstanceDomain(event: any): void {
    this.endEditInstanceDomain(event);
  }

  public updateSettings(value: InnovationSettings): void {
    this._project.settings = value;
    this._dirty = true;
  }

  public generateQuiz(event: Event): void {
    event.preventDefault();
    this._innovationService
      .createQuiz(this._project._id)
      .first()
      .subscribe((p) => {
        this._project = p;
        this._notificationsService.success('ERROR.ACCOUNT.UPDATE' , 'ERROR.QUIZ.CREATED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
      });
  }

  /**
   * Sauvegarde
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

  public getPrincipalMedia(project: Innovation): string {
    if (project.principalMedia) {
      if (project.principalMedia.type === 'PHOTO') {
        return 'https://res.cloudinary.com/umi/image/upload/c_scale,h_260,w_260/' + project.principalMedia.cloudinary.public_id;
      } else {
        return project.principalMedia.video.thumbnail;
      }
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/no-image.png';
    }
  }

  public hasPreset(): boolean {
    const p = this._project.preset;

    return (p && p.sections && p.constructor === Object && Object.keys(p.sections).length > 0);
  }

  public notifyClass(): string {
    if (this._dirty) {
      return 'btn ghost-primary btn-lg badge';
    } else {
      return 'btn ghost-primary btn-lg';
    }
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
