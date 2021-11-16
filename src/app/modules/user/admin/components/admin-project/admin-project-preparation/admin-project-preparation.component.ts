import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouteFrontService } from '../../../../../../services/route/route-front.service';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../../../models/innovation';
import { Router } from '@angular/router';
import { InnovCard } from '../../../../../../models/innov-card';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { first, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Campaign } from '../../../../../../models/campaign';
import { Subject } from 'rxjs';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { isPlatformBrowser } from '@angular/common';
import { Response } from '../../../../../../models/response';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { SocketService } from '../../../../../../services/socket/socket.service';
import { MissionService } from '../../../../../../services/mission/mission.service';
import { Mission } from '../../../../../../models/mission';
import { environment } from '../../../../../../../environments/environment';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';

@Component({
  templateUrl: './admin-project-preparation.component.html',
  styleUrls: ['./admin-project-preparation.component.scss']
})

export class AdminProjectPreparationComponent implements OnInit, OnDestroy {

  get quizPreviewLink(): string {
    return this._quizPreviewLink;
  }

  private _defaultTabs: Array<string> = ['description', 'questionnaire', 'targeting', 'campaigns', 'statistics'];

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

  private _allCampaigns: Array<Campaign> = this._campaignFrontService.allCampaigns;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _toBeSaved = '';

  private _isLoadingCampaign = false;

  private _toBeSavedComment = false;

  private _quizPreviewLink = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _routeFrontService: RouteFrontService,
              private _router: Router,
              private _innovationService: InnovationService,
              private _campaignFrontService: CampaignFrontService,
              private _missionService: MissionService,
              private _innovationFrontService: InnovationFrontService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService,
              private _socketService: SocketService) {
  }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._project = innovation || <Innovation>{};
      this.setPageTitle();
      this._setActiveCardIndex();
      this._quizPreviewLink = `${environment.quizUrl}/quiz/${this._project._id}/preview`;
    });

    // Cards text has already been saved by another user
    this._socketService.getProjectFieldUpdates(this._project._id, 'innovationCards')
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((update: any) => {
        // We keep our changes to be saved except innovationCards
        this._toBeSaved = this._toBeSaved.replace(/(innovationCards[,]?)/g, '');
      }, (error) => {
        console.error(error);
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
    });

    this._campaignFrontService.activeCampaign().pipe(takeUntil(this._ngUnsubscribe)).subscribe((campaign) => {
      this._selectedCampaign = campaign || <Campaign>{};
    });

    this._campaignFrontService.showCampaignTabs().pipe(takeUntil(this._ngUnsubscribe)).subscribe((show) => {
      this._showCampaignTabs = show;
    });

    this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((save) => {
      this._toBeSaved = this._toBeSaved ? this._toBeSaved + ',' + save.key : save.key;
    });

    this._innovationFrontService.getCardCommentNotifyChanges()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((save) => {
        this._toBeSavedComment = save;
      });

    this._campaignFrontService.loadingCampaign().pipe(takeUntil(this._ngUnsubscribe)).subscribe((loading) => {
      this._isLoadingCampaign = loading;
    });
  }

  private _setInnovation() {
    this._innovationFrontService.setInnovation(this._project);
  }

  public setCampaign(campaign: Campaign) {
    if (campaign._id !== this._selectedCampaign._id) {
      this._isLoadingCampaign = true;
      this._selectedCampaign = campaign;
      this._router.navigate([this.routeToNavigate(this._activeTab)]);
    }
  }

  public setPageTitle(tab?: string) {
    this._activeTab = tab ? tab : this._activeTab;
    if (this._showCampaignTabs) {
      this._translateTitleService.setTitle(`${this._activeTab.slice(0, 1).toUpperCase()}${this._activeTab.slice(1)}
      | Campaign | Campaigns | Preparation | ${this._project.name}`);
    } else {
      this._translateTitleService.setTitle(`${this._activeTab.slice(0, 1).toUpperCase()}${this._activeTab.slice(1)}
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
        this._translateNotificationsService.error('Campaigns Fetching Error...', ErrorFrontService.adminErrorMessage(err));
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

  public openModal(event: Event, type: 'ADD_LANG' | 'DELETE_LANG', deleteCard?: InnovCard) {
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

  public onSave(event: Event) {
    event.preventDefault();

    if (!this._isSaving && (this._toBeSaved || this._toBeSavedComment)) {
      if (this._activeTab === 'questionnaire') {
        if (this._toBeSaved.indexOf('mission') !== -1) {
          this._isSaving = true;
          this._saveMission({template: (<Mission>this._project.mission).template});
        } else if (this._toBeSaved.indexOf('preset') !== -1) {
          this._isSaving = true;
          this._saveProject({preset: this._project.preset});
        }
      } else {
        this._isSaving = true;
        const fields = this._toBeSaved.split(',');
        const saveObject = {};
        fields.forEach(field => {
          saveObject[field] = this._project[field];
        });

        if (this._toBeSavedComment) {
          this._saveComment().then((value) => {
            if (value && !!saveObject) {
              this._saveProject(saveObject);
            }
          }).catch((err: HttpErrorResponse) => {
            this._isSaving = false;
            this._toBeSavedComment = true;
            this._translateNotificationsService.error(
              'Comment Saving Error...', ErrorFrontService.adminErrorMessage(err));
            console.error(err);
          });
        } else if (!!saveObject) {
          this._saveProject(saveObject);
        }
      }
    }
  }

  private _saveMission(missionObj: { [P in keyof Mission]?: Mission[P]; }) {
    const id = this._project.mission && (<Mission>this._project.mission)._id;
    if (!!id) {
      this._missionService.save(id, missionObj).pipe(first()).subscribe((mission) => {
        this._project.mission = mission;
        this._isSaving = false;
        this._toBeSaved = '';
        this._setInnovation();
        this._translateNotificationsService.success('Success', 'The project has been updated.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Project Saving Error...', ErrorFrontService.adminErrorMessage(err));
        this._isSaving = false;
        console.error(err);
      });
    }
  }

  private _saveProject(objToSave: any) {
    this._innovationService.save(this._project._id, objToSave).pipe(first()).subscribe(() => {
      this._isSaving = false;
      this._toBeSaved = '';
      this._setInnovation();
      this._translateNotificationsService.success('Success', 'The project has been updated.');
    }, (err: HttpErrorResponse) => {
      this._isSaving = false;
      this._translateNotificationsService.error('Project Saving Error...', ErrorFrontService.adminErrorMessage(err));
      console.error(err);
    });
  }

  private _saveComment() {
    return new Promise((resolve, reject) => {
      if (this._toBeSavedComment) {
        this._innovationService.saveInnovationCardComment(this._project._id, this.activeCard._id,
          this.activeCard.operatorComment).pipe(first()).subscribe((_) => {
          this._isSaving = false;
          this._toBeSavedComment = false;
          this._translateNotificationsService.success('Success', 'The comments/suggestions have been updated.');
          resolve(true);
        }, (err: HttpErrorResponse) => {
          reject(err);
        });
      } else {
        resolve(true);
      }
    });
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
        this._translateNotificationsService.success('Success',
          `The project has been added in the ${_lang === 'fr' ? 'French' : 'English'} language.`);
        this.closeModal();
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Card Adding Error...', ErrorFrontService.adminErrorMessage(err));
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
        this._translateNotificationsService.success('Success',
          `The project has been deleted in the ${this._cardToDelete.lang === 'fr' ? 'French' : 'English'} language.`);
        this.closeModal();
      }, (err: HttpErrorResponse) => {
        this._cardToDelete = <InnovCard>{};
        this._translateNotificationsService.error('Card Deleting Error...', ErrorFrontService.adminErrorMessage(err));
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

  get toBeSaved(): string {
    return this._toBeSaved;
  }

  get isLoadingCampaign(): boolean {
    return this._isLoadingCampaign;
  }

  get toBeSavedComment(): boolean {
    return this._toBeSavedComment;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
