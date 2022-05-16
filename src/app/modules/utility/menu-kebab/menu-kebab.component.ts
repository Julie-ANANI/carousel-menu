import {AfterViewInit, ChangeDetectorRef, Component, ContentChildren, Directive, Inject, Input, PLATFORM_ID, QueryList} from '@angular/core';
import {Innovation} from '../../../models/innovation';
import {RouteFrontService} from '../../../services/route/route-front.service';
import {InnovCard} from '../../../models/innov-card';
import {InnovationFrontService} from '../../../services/innovation/innovation-front.service';
import {RolesFrontService} from '../../../services/roles/roles-front.service';
import {Campaign} from '../../../models/campaign';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {InnovationService} from '../../../services/innovation/innovation.service';
import {CampaignFrontService} from '../../../services/campaign/campaign-front.service';
import {MissionService} from '../../../services/mission/mission.service';
import {TranslateNotificationsService} from '../../../services/translate-notifications/translate-notifications.service';
import {TranslateTitleService} from '../../../services/title/title.service';
import {SocketService} from '../../../services/socket/socket.service';
import {first, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../services/error/error-front.service';
import {Mission} from '../../../models/mission';
import {MenuKebabDirective} from './menu-kebab.directive';

@Directive({
  selector: '.kebab-carousel-item'
})
export class KebabCarouselItemElement {
}

@Component({
  selector: 'app-menu-kebab',
  exportAs:'app-menu-kebab',
  template: `
<!-- We create template for this utility-->
    <section class="bg-white sticky header-wrapper kebab-carousel-wrapper">
      <div class="d-flex relative m-top-30 align-center container fluid">
      <ul class="kebab-carousel-inner" #carousel>
        <li> *ngFor="let item of items;" class="kebab-carousel-item">
         <!--   we can't use a simple content of projection because we want curl items
            The solution is use ng-template-->
           <!--     We use ng-template-outlet for defined a template parameters who pass in component entry
           It's for have a reference to a item-->
          <ng-container [ngTemplateOutlet]="item.template"><</ng-container>
        </li>
      </ul>
      </div>
    </section>
  `,
  styles: [`
    .kebab-carousel-wrapper {
      overflow: hidden;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      height: 40px;
    }
    .kebab-carousel-inner {
      display: flex;
    }
 `]
})

export class MenuKebabComponent implements AfterViewInit {
  @ContentChildren(MenuKebabDirective) items : QueryList<MenuKebabDirective>;

  @Input() items11 = [
    'french_1',
    'english_2',
    'spanish_3',
    'german_4',
    'dutch_5',
    'french_6',
    'english_7',
    'spanish_8',
    'german_9',
    'dutch_10',
    'french_11'
  ];

  @Input() items12 = [
    'french',
    'english',
    'spanish',
    'german',
    'dutch',
    'french',
    'english',
    'spanish',
    'german',
    'dutch',
    'french',
    'french',
  ];

  public displayItems (){

    for(let [keys, item] of items11){

            if(keys < 5 && this.displaySuiteKebabItems){
              return item;
            }
    }
  }

  // @Input() color = '#EFEFEF';
  // @Input() btnViewColor = '#4F5D6B';
  // @Input() textColor = '#00B0FF';
  // @Input() isActive = false;
  // @Input() middleDelimitersOfItems = 10;
  // @Input() maxDelimitersOfItems = 18;
  // @Input() minDelimitersOfItems = 5;

  //private _isDisplayItems = false;

  //private _displaySuiteKebabItems = false;

  //private _displayBackItems = false;

  //private _displayFrontItems = false;

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

  private _toBeSaved = '';

  private _toBeSavedComment = false;

  private _showModal = false;


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
              private _changeDetectorRef: ChangeDetectorRef,
              private _activatedRoute: ActivatedRoute,
              private _socketService: SocketService) {
  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.data['allCampaign']
      && typeof this._activatedRoute.snapshot.data['allCampaign'] !== undefined) {
      this._allCampaigns = this._activatedRoute.snapshot.data['allCampaign'].result || [];
    }

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      if (innovation && innovation._id) {
        this._project = innovation;
        this.setPageTitle();
        this._setActiveCardIndex();
      }
    });

    // Cards text has already been saved by another user
    this._socketService.getProjectFieldUpdates(this._project._id, 'innovationCards')
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((_) => {
        // We keep our changes to be saved except innovationCards
        this._toBeSaved = this._toBeSaved.replace(/(innovationCards[,]?)/g, '');
      }, (error) => {
        console.error(error);
      });

    this._campaignFrontService.activeCampaignTab().pipe(takeUntil(this._ngUnsubscribe)).subscribe((tab) => {
      if (tab && this._activeTab !== tab) {
        this._activeTab = tab;
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
      if (save.autoSave) {
        this.onSave(new Event(''))
      }
    });

    this._innovationFrontService.getCardCommentNotifyChanges()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((save) => {
        this._toBeSavedComment = save;
      });
  }

  ngAfterViewChecked() {
    this._changeDetectorRef.detectChanges();
  }


  private _emitUpdatedInnovation() {
    this._innovationFrontService.setInnovation(this._project);
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

  public openModal(event: Event, type: 'ADD_LANG' | 'DELETE_LANG' | 'ASK_VALIDATION', deleteCard?: InnovCard) {
    event.preventDefault();
    this._modelType = type;

    switch (type) {

      case 'ASK_VALIDATION':
        this._showModal = true;
        break;

      case 'ADD_LANG':
        if (this.canAddCard && !this._isAddingCard) {
          this._showCardModal = true;
        }
        break;

      case 'DELETE_LANG':
        if (!this._isDeletingCard) {
          this._cardToDelete = deleteCard;
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
              'Comment Saving Error...', ErrorFrontService.getErrorKey(err.error));
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
      this._missionService.save(id, missionObj).pipe(first()).subscribe((_) => {
        this._isSaving = false;
        this._toBeSaved = '';
        this._translateNotificationsService.success('Success', 'The project has been updated.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Project Saving Error...', ErrorFrontService.getErrorKey(err.error));
        this._isSaving = false;
        console.error(err);
      });
    }
  }

  private _saveProject(objToSave: any) {
    this._innovationService.save(this._project._id, objToSave).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Success', 'The project has been updated.');
      this._isSaving = false;
      this._toBeSaved = '';
    }, (err: HttpErrorResponse) => {
      this._isSaving = false;
      this._translateNotificationsService.error('Project Saving Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  private _saveComment() {
    return new Promise((resolve, reject) => {
      if (this._toBeSavedComment) {
        this._innovationService.saveInnovationCardComment(this._project._id, this.activeCard._id, this.activeCard.operatorComment)
          .pipe(first()).subscribe((_) => {
          this._emitUpdatedInnovation();
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
    this._showModal = false;
  }

  public deleteInnovationCard(event: Event) {
    event.preventDefault();

    if (!this._isDeletingCard && this.showLangDrop) {
      this._isDeletingCard = true;
      this._innovationService.removeInnovationCard(this._project._id, this._cardToDelete._id).pipe(first()).subscribe(() => {
        this._project.innovationCards = this._project.innovationCards.filter((value) => value._id !== this._cardToDelete._id);
        this._emitUpdatedInnovation();
        this._isDeletingCard = false;
        this._translateNotificationsService.success('Success',
          `The project has been deleted in the ${this._cardToDelete.lang === 'fr' ? 'French' : 'English'} language.`);
        this.closeModal();
      }, (err: HttpErrorResponse) => {
        this._cardToDelete = <InnovCard>{};
        this._translateNotificationsService.error('Card Deleting Error...', ErrorFrontService.getErrorKey(err.error));
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


  get campaignTabs(): Array<string> {
    return this._campaignTabs;
  }

  get activeTab(): string {
    return this._activeTab;
  }

  // get showCardModal(): boolean {
  //   return this._showCardModal;
  // }
  //
  // set showCardModal(value: boolean) {
  //   this._showCardModal = value;
  // }

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


  get allCampaigns(): Array<Campaign> {
    return this._allCampaigns;
  }

  get toBeSaved(): string {
    return this._toBeSaved;
  }

  get toBeSavedComment(): boolean {
    return this._toBeSavedComment;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  // get displaySuiteKebabItems(): boolean {
  //   return this._displaySuiteKebabItems;
  // }
  //
  // set displaySuiteKebabItems(value: boolean) {
  //   this._displaySuiteKebabItems = value;
  // }
  //
  // get isDisplayItems(): boolean {
  //   return this._isDisplayItems;
  // }
  //
  // set isDisplayItems(value: boolean) {
  //   this._isDisplayItems = value;
  // }
  //
  // get displayBackItems(): boolean {
  //   return this._displayBackItems;
  // }
  //
  // set displayBackItems(value: boolean) {
  //   this._displayBackItems = value;
  // }
  //
  // get displayFrontItems(): boolean {
  //   return this._displayFrontItems;
  // }
  //
  // set displayFrontItems(value: boolean) {
  //   this._displayFrontItems = value;
  // }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}


