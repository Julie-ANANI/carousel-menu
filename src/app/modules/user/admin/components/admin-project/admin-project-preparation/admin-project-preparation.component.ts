import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {RouteFrontService} from '../../../../../../services/route/route-front.service';
import {TranslateTitleService} from '../../../../../../services/title/title.service';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {Innovation} from '../../../../../../models/innovation';
import {Router} from '@angular/router';
import {InnovCard} from '../../../../../../models/innov-card';
import {InnovationService} from '../../../../../../services/innovation/innovation.service';
import {first, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {Campaign} from '../../../../../../models/campaign';
import {Subject} from 'rxjs';
import {CampaignFrontService} from '../../../../../../services/campaign/campaign-front.service';
import {isPlatformBrowser} from '@angular/common';
import {Response} from '../../../../../../models/response';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';

@Component({
  templateUrl: './admin-project-preparation.component.html',
  styleUrls: ['./admin-project-preparation.component.scss']
})

export class AdminProjectPreparationComponent implements OnInit, OnDestroy {

  private _defaultTabs: Array<string> = ['description', 'questionnaire', 'targeting', 'campaigns'];

  private _campaignTabs: Array<string> = ['search', 'history', 'pros', 'workflows', 'batch'];

  private _activeTab = this._routeFrontService.activeTab(8, 7);

  private _project: Innovation = <Innovation>{};

  private _activeCardIndex = 0;

  private _isSaving = false;

  private _isAddingCard = false;

  private _showCardModal = false;

  private _modelType = '';

  private _isDeletingCard = false;

  private _cardToDelete: InnovCard = <InnovCard>{};

  private _showCampaignTabs = false;

  private _selectedCampaign: Campaign = <Campaign>{};

  private _allCampaigns: Array<Campaign> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _toBeSaved = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _routeFrontService: RouteFrontService,
              private _router: Router,
              private _innovationService: InnovationService,
              private _campaignFrontService: CampaignFrontService,
              private _innovationFrontService: InnovationFrontService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {}

  ngOnInit() {

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._project = innovation || <Innovation>{};
      this.setPageTitle();
      this._setActiveCardIndex();
    });

    this._campaignFrontService.activeCampaignTab().pipe(takeUntil(this._ngUnsubscribe)).subscribe((tab) => {
      if (tab && this._activeTab !== tab) {
        this._activeTab = tab;
        this._getAllCampaigns();
        setTimeout(() => {
          this._showCampaignTabs = true;
          this.setPageTitle();
        }, 100);
      }
    })

    this._campaignFrontService.allCampaigns().pipe(takeUntil(this._ngUnsubscribe)).subscribe((campaigns) => {
      this._allCampaigns = campaigns || [];
    });

    this._campaignFrontService.activeCampaign().pipe(takeUntil(this._ngUnsubscribe)).subscribe((campaign) => {
      this._selectedCampaign = campaign || <Campaign>{};
    });

    this._campaignFrontService.showCampaignTabs().pipe(takeUntil(this._ngUnsubscribe)).subscribe((show) => {
      this._showCampaignTabs = show;
    });

    this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((save) => {
      this._toBeSaved = save;
    });

  }

  private _setInnovation() {
    this._innovationFrontService.setInnovation(this._project);
  }

  public setCampaign(campaign: Campaign) {
    this._selectedCampaign = campaign;
    this._campaignFrontService.setActiveCampaign(this._selectedCampaign);
  }

  public setPageTitle(tab?: string) {
    this._activeTab = tab ? tab : this._activeTab;
    if (this._showCampaignTabs) {
      this._translateTitleService.setTitle(`${this._activeTab.slice(0,1).toUpperCase()}${this._activeTab.slice(1)} 
      | Campaign | Campaigns | Preparation | ${this._project.name}`);
    } else {
      this._translateTitleService.setTitle(`${this._activeTab.slice(0,1).toUpperCase()}${this._activeTab.slice(1)} 
      | Preparation | ${this._project.name}`);
    }
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project'];
    return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
  }

  public canAccessTab(tab: string): boolean {
    if (this._showCampaignTabs) {
      return this.canAccess(['campaigns', 'campaign', tab]);
    } else {
      if (tab === 'description') {
        return this.canAccess(['settings', 'view', 'description']) || this.canEditDescription;
      } else if (tab === 'targeting') {
        return this.canAccess(['settings', 'view', 'targeting']) || this.canEditTargeting;
      }
      return this.canAccess([tab]);
    }
  }

  private _getAllCampaigns() {
    if (isPlatformBrowser(this._platformId) && !this._allCampaigns.length) {
      this._innovationService.campaigns(this._project._id).pipe(first()).subscribe((response: Response) => {
        this._allCampaigns = response && response.result || [];
        this._campaignFrontService.setAllCampaigns(this._allCampaigns);
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    }
  }

  public navigateTo(value: string) {
    this.setPageTitle(value);
    if (value === 'description') {
      this._activeCardIndex = 0;
      this._setActiveCardIndex();
    }
    this._router.navigate([this.routeToNavigate(value)]);
  }

  public routeToNavigate(tab: string): string {
    if (this._showCampaignTabs) {
      return `/user/admin/projects/project/${this._project._id}/preparation/campaigns/campaign/${this._selectedCampaign._id}/${tab}`;
    } else {
      return `/user/admin/projects/project/${this._project._id}/preparation/${tab}`;
    }
  }

  public backToCampaigns() {
    this._campaignFrontService.setShowCampaignTabs(false);
    this._router.navigate([`/user/admin/projects/project/${this._project._id}/preparation/campaigns`]);
  }

  public openModal(event: Event, type: 'ADD_LANG'| 'DELETE_LANG', deleteCard?: InnovCard) {
    event.preventDefault();
    switch (type) {

      case 'ADD_LANG':
        if (this.canAddCard && !this._isAddingCard) {
          this._modelType = type;
          this._showCardModal = true;
        }
        break;

      case 'DELETE_LANG':
        if (!this._isDeletingCard) {
          this._cardToDelete = deleteCard;
          this._modelType = type;
          this._showCardModal = true;
        }
        break;

    }
  }

  public setCardLang(value: string) {
    if (this.activeCard && !(this._cardToDelete._id)) {
      this._activeCardIndex = InnovationFrontService.currentLangInnovationCard(this._project, value, 'INDEX');
      this._setActiveCardIndex();
    }
  }

  public onSaveProject(event: Event) {
    event.preventDefault();
    if (!this._isSaving && this._toBeSaved) {
      this._isSaving = true;
      this._toBeSaved = false;
      this._innovationService.save(this._project._id, this._project).pipe(first()).subscribe(() => {
        this._isSaving = false;
        this._setInnovation();
        this._translateNotificationsService.success('Success', 'The project has been updated.');
      }, (err: HttpErrorResponse) => {
        this._isSaving = false;
        this._toBeSaved = true;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    }
  }

  private _setActiveCardIndex() {
    this._innovationFrontService.setActiveCardIndex(this._activeCardIndex);
  }

  public closeModal() {
    this._showCardModal = false;
    this._cardToDelete = <InnovCard>{};
  }

  public addInnovationCard(event: Event) {
    event.preventDefault();

    if (this.canAddCard && !this._isAddingCard) {
      this._isAddingCard = true;
      const _lang = this.activeCard.lang === 'en' ? 'fr' : 'en';
      const _card = new InnovCard({lang: _lang});
      this._innovationService.createInnovationCard(this._project._id, _card).pipe(first()).subscribe((card) => {
        this._project.innovationCards.push(card);
        this._setInnovation();
        this._isAddingCard = false;
        this.closeModal();
        this._translateNotificationsService.success('Success',
          `The project has been added in the ${_lang === 'fr' ? 'French' : 'English'} language.`);
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isAddingCard = false;
        console.error(err);
      });
    }

  }

  public deleteInnovationCard(event: Event) {
    event.preventDefault();

    if (!this._isDeletingCard && this.showLangDrop) {
      this._isDeletingCard = true;
      this._innovationService.removeInnovationCard(this._project._id, this._cardToDelete._id).pipe(first()).subscribe(() => {
        this._project.innovationCards = this._project.innovationCards.filter((value) => value._id !== this._cardToDelete._id);
        this._setInnovation();
        this._isDeletingCard = false;
        this.closeModal();
        this._translateNotificationsService.success('Success',
          `The project has been deleted in the ${this._cardToDelete.lang === 'fr' ? 'French' : 'English'} language.`);
      }, (err: HttpErrorResponse) => {
        this._cardToDelete = <InnovCard>{};
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isDeletingCard = false;
        console.error(err);
      });
    }

  }

  get activeCard(): InnovCard {
    return InnovationFrontService.activeCard(this._project, this._activeCardIndex);
  }

  get canEditTargeting(): boolean {
    return this.canAccess(['settings', 'edit', 'targeting']);
  }

  get canEditDescription(): boolean {
    return this.canAccess(['settings', 'edit', 'description']);
  }

  get canAddCard(): boolean {
    return this._project.innovationCards && this._project.innovationCards.length === 1;
  }

  get showLangDrop(): boolean {
    return this._project.innovationCards && this._project.innovationCards.length > 1;
  }

  get defaultTabs(): Array<string> {
    return this._defaultTabs;
  }

  get campaignTabs(): Array<string> {
    return this._campaignTabs;
  }

  get activeTab(): string {
    return this._activeTab;
  }

  get showCardModal(): boolean {
    return this._showCardModal;
  }

  set showCardModal(value: boolean) {
    this._showCardModal = value;
  }

  get project(): Innovation {
    return this._project;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  get isAddingCard(): boolean {
    return this._isAddingCard;
  }

  get modelType(): string {
    return this._modelType;
  }

  get isDeletingCard(): boolean {
    return this._isDeletingCard;
  }

  get cardToDelete(): InnovCard {
    return this._cardToDelete;
  }

  get showCampaignTabs(): boolean {
    return this._showCampaignTabs;
  }

  get selectedCampaign(): Campaign {
    return this._selectedCampaign;
  }

  get allCampaigns(): Array<Campaign> {
    return this._allCampaigns;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
