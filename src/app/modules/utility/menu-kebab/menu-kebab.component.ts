import {
  AfterViewInit, ChangeDetectorRef, Component,
  ContentChildren,
  Directive, Inject, Input, PLATFORM_ID, QueryList, ElementRef,
  ViewChildren, ViewChild, OnInit, TemplateRef, EventEmitter
} from '@angular/core';
import { Innovation } from '../../../models/innovation';
import { RouteFrontService } from '../../../services/route/route-front.service';
import { InnovCard } from '../../../models/innov-card';
import { InnovationFrontService } from '../../../services/innovation/innovation-front.service';
import { RolesFrontService } from '../../../services/roles/roles-front.service';
import { Campaign } from '../../../models/campaign';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { InnovationService } from '../../../services/innovation/innovation.service';
import { CampaignFrontService } from '../../../services/campaign/campaign-front.service';
import { MissionService } from '../../../services/mission/mission.service';
import { TranslateNotificationsService } from '../../../services/translate-notifications/translate-notifications.service';
import { TranslateTitleService } from '../../../services/title/title.service';
import { SocketService } from '../../../services/socket/socket.service';
import { first, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../services/error/error-front.service';
import { Mission } from '../../../models/mission';
import { MenuKebabDirective } from './menu-kebab.directive';
import { AnimationFactory, AnimationPlayer, AnimationBuilder, animate, style } from '@angular/animations';


export class CarouselItemElement {
}


@Component({
  selector: 'carousel',
  exportAs: 'carousel',
  templateUrl: './menu-kebab.html',
  styleUrls: ['./menu-kebab.scss'],
})


export class MenuKebabComponent implements OnInit {

  // TODO all
  @ContentChildren(MenuKebabDirective) items: QueryList<MenuKebabDirective>;
  @ViewChildren(CarouselItemElement, {read: ElementRef}) private _itemsElements: QueryList<ElementRef>;
  @ViewChild('carousel') private carousel: ElementRef;

  // false: displayItem[0] compare to sources[0]
  showPrev = true;

  // false: displayItem[last] compare to sources[last]
  showNext = true;

  // TODO all

  /**
   * TODO: to change
   */
  next() {
    if (this.currentItem + 1 === this.items.length) return;
    this.currentItem = (this.currentItem + 1) % this.items.length;
    //const offset = this.currentItem * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation();
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  // TODO remove
  private buildAnimation() {
    return this.builder.build([
      animate(this.timing, style({transform: `translateX(-150px)`}))
    ]);
  }

  /**
   * TODO: to change
   */
  prev() {
    // get first item in displayedItems
    // go through sources
    // find first item in sources, and get the index.
    // if index > 5 => change completely the displayedItems
    // if index < 5 => take what's in former sources + what's left in displayedItems
    //
    // if (this.currentItem === 0) return;
    //
    // this.currentItem = ((this.currentItem - 1) + this.items.length) % this.items.length;
    // //const offset = this.currentItem * this.itemWidth;
    //
    // const myAnimation: AnimationFactory = this.buildAnimation();
    // this.player = myAnimation.create(this.carousel.nativeElement);
    // this.player.play();
  }


  // ngAfterViewInit() {
  //
  //   setTimeout(() => {
  //     this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
  //     this.carouselWrapperStyle = {
  //       width: `${this.itemWidth}px`
  //     }
  //   });
  //   throw new Error("Method not implemented.");
  // }

  @Input() showControls = true;
  @Input() timing = '250ms ease-in';

  //Size
  @Input() kebabCarouselWidth = {};
  @Input() minDelimitersOfItems = 5;

  //color
  @Input() color = '#EFEFEF';
  @Input() btnViewColor = '#4F5D6B';
  @Input() textColor = '#00B0FF';


  // Config Template
  @Input() itemTemplate: TemplateRef<{ item: any }>
  // @Input() initialState: 'expandable' | 'collapsed' = 'collapsed';
  // @Input() expandable = false;

  public alwaysDisplayedItems: string[] = [];
  public menueExpandableItems: string[] = [];

  //size
  private itemWidth: number;
  carouselWrapperStyle = {}
  private _initItemSize = true;

  //item
  private currentItem: number = 0;

  /**
   * here, you get configuration for the menu
   * @param value
   * quatity = 5
   */
  @Input() set config(value: any) {
    if (value) {
        this._quatity = value.quatity || 0;
        this._sources = value.sources || [];
        this._identifier = value.identifier || '';
        // TODO check sources
      //initialise _displayedItems
        this._displayedItems = this._sources.slice(0, this._quatity);
    }
  }

  //Config Template
  private _isDisplayItems = false;
  private _displaySuiteKebabItems = true;
  private player: AnimationPlayer;


  //Tabs
  private _campaignTabs: Array<string> = ['search', 'history', 'pros', 'workflows', 'batch'];
  private _activeTab = this._routeFrontService.activeTab(8, 7);

  //Innovation / Card
  private _project: Innovation = <Innovation>{};
  private _selectedCampaign: Campaign = <Campaign>{};
  private _allCampaigns: Array<Campaign> = [];

  //CardLang
  private _activeCardIndex = 0;
  private _isSaving = false;
  private _isAddingCard = false;
  private _showCardModal = false;
  private _modelType = '';
  private _isDeletingCard = false;
  private _cardToDelete: InnovCard = <InnovCard>{};
  private _showCampaignTabs = false;
  private _toBeSaved = '';
  private _toBeSavedComment = false;
  private _showModal = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _config: any;

  private _quatity: number = 0;

  private _identifier: string = '';

  private _sources: Array<any> = [];

  private _displayedItems: Array<any> = [];

  private _clickOnMenu: EventEmitter<any> = new EventEmitter();


  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _routeFrontService: RouteFrontService,
              private _router: Router,
              private _innovationService: InnovationService,
              private _missionService: MissionService,
              private _innovationFrontService: InnovationFrontService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService,
              private builder: AnimationBuilder) {
  }

  ngOnInit() {

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

  get displaySuiteKebabItems(): boolean {
    return this._displaySuiteKebabItems;
  }

  set displaySuiteKebabItems(value: boolean) {
    this._displaySuiteKebabItems = value;
  }

  get isDisplayItems(): boolean {
    return this._isDisplayItems;
  }

  set isDisplayItems(value: boolean) {
    this._isDisplayItems = value;
  }

  get initItemSize(): boolean {
    return this._initItemSize;
  }


  get itemsElements(): QueryList<ElementRef> {
    return this._itemsElements;
  }

  get quatity(): number {
    return this._quatity;
  }

  get identifier(): string {
    return this._identifier;
  }

  get sources(): Array<any> {
    return this._sources;
  }

  get displayedItems(): Array<any> {
    return this._displayedItems;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  clickOnMenu(event: Event, item: any) {
    event.preventDefault();
    this._clickOnMenu.emit(item);
  }
}


