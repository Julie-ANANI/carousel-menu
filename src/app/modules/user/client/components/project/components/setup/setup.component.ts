import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Innovation } from '../../../../../../../models/innovation';
import { first, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { SidebarInterface } from '../../../../../../sidebars/interfaces/sidebar-interface';
import { InnovCard } from '../../../../../../../models/innov-card';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../../../services/error/error-front.service';

interface Banner {
  message: string;
  background: string;
}

interface Tab {
  route: string;
  iconClass: string;
  name: string;
  tracking: string;
}

@Component({
  selector: 'app-project-setup',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _scrollOn = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _currentPage = '';

  private _saveChanges = false;

  private _sidebarTemplate: SidebarInterface = <SidebarInterface>{
    animate_state: 'inactive',
    title: 'SIDEBAR.TITLE.PREVIEW',
    size: '726px'
  };

  private _innovCardToPreview: InnovCard = <InnovCard>{};

  private _innovationExample: Innovation = <Innovation>{};

  private _banner: Banner = <Banner>{};

  private _showBanner = false;

  private _isBannerViewed = false;

  private _activeCardIndex = 0;

  private _activeInnovCard: InnovCard = <InnovCard>{};

  private _tabs: Array<Tab> = [
    { route: 'setup/pitch', iconClass: 'icon icon-check', name: 'PITCH', tracking: 'gtm-edit-market-targeting' },
    { route: 'setup/targeting', iconClass: 'icon icon-check', name: 'TARGETING', tracking: 'gtm-edit-market-targeting' },
    { route: 'setup/survey', iconClass: 'icon icon-check', name: 'QUESTIONNAIRE', tracking: 'gtm-edit-market-targeting' },
  ];

  private _isExampleAvailable = false;

  private _showCardModal = false;

  private _isAddingCard = false;

  private _isSavingProject = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _router: Router,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) {

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._getCurrentPage();
      }
    });

  }

  ngOnInit() {
    this._getCurrentPage();
    this._getExampleInnovation();

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      this._initBanner();
      this._initInnovCard();
    });

    this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._saveChanges = response;
    });

  }

  private _getCurrentPage() {
    const _url = this._router.routerState.snapshot.url.split('/');
    if (_url.length > 0) {
      const _value = _url[_url.length-1];
      const _params = _value.indexOf('?');
      this._currentPage = (_params > 0 ? _value.substring(0, _params) : _value).toUpperCase();
    } else {
      this._currentPage = 'PITCH';
    }
  }

  private _getExampleInnovation() {
    if (isPlatformBrowser(this._platformId)) {
      this._innovationService.get('5dbb0b0f07eacfdfae0e2aa1').pipe(first()).subscribe((response) => {
        this._innovationExample = response;
        this._isExampleAvailable =  this._innovationExample.innovationCards && this._innovationExample.innovationCards.length !== 0;
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  /***
   * we are getting the scroll value for the sticky bar.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this._scrollOn = window.pageYOffset > 50 || window.scrollY > 50;
  }

  private _initBanner() {
    if (!this._isBannerViewed) {
      this._banner.background = this._innovation.status === 'DONE' ? '#2ECC71' : '#F89424';
      this._banner.message = this._bannerMessage();
      if (this._banner.message !== '') {
        this._showBanner = true;
        this._isBannerViewed = true;
      }
    }
  }

  private _bannerMessage(): string {
    if (this._innovation.reviewing && this._innovation.status === 'EDITING') {
      return 'PROJECT_SETUP.BANNER_MESSAGES.REVIEWING';
    } else if (this._innovation.status === 'SUBMITTED') {
      return 'PROJECT_SETUP.BANNER_MESSAGES.SUBMITTED';
    } else if (this._innovation.status === 'EVALUATING') {
      return 'PROJECT_SETUP.BANNER_MESSAGES.EVALUATING';
    } else if (this._innovation.status === 'DONE') {
      return 'PROJECT_SETUP.BANNER_MESSAGES.DONE';
    } else {
      return '';
    }
  }

  private _initInnovCard() {
    if (this._innovation.innovationCards && this._innovation.innovationCards.length) {
      this._activeInnovCard = this._innovation.innovationCards[this._activeCardIndex];
    }
  }

  public onChangeLang(event: Event) {
    event.preventDefault();
    if (this._innovation.innovationCards && this._innovation.innovationCards.length > 1) {
      this._activeCardIndex = this._activeCardIndex === 0 ? 1 : 0;
      this._initInnovCard();
    }
  }

  public navigateTo(event: Event, route: string) {
    event.preventDefault();
    this._router.navigate([`/user/projects/${this._innovation._id}/${route}`]);
  }

  public onViewExample(event: Event) {
    event.preventDefault();

    const _lang = this._innovation.innovationCards[this._activeCardIndex].lang;
    const _index = this._innovationExample.innovationCards.findIndex((card) => card.lang === _lang);

    this._innovCardToPreview = _index !== -1 ? this._innovationExample.innovationCards[_index]
      : this._innovationExample.innovationCards[0];

    this._sidebarTemplate = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.EXAMPLE',
      size: '726px'
    };

  }

  /***
   * this function is called when the user wants to preview the innovation card.
   * @param event
   */
  public onViewInnovCard(event: Event) {
    event.preventDefault();
    this._innovCardToPreview = this._innovation.innovationCards[this._activeCardIndex];
    this._sidebarTemplate = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.PREVIEW',
      size: '726px'
    };
  }

  public isComplete(tabName: string) {
    if (tabName === 'PITCH' && this._innovation.innovationCards && this._innovation.innovationCards.length) {
      let total = 0;
      this._innovation.innovationCards.forEach((innovationCard: InnovCard) => {
        total += innovationCard.completion;
      });
      return (total / this._innovation.innovationCards.length) === 100;
    } else if (tabName === 'TARGETING' && this._innovation.settings && this._innovation.settings.completion) {
      return this._innovation.settings.completion === 100;
    } else if (tabName === 'QUESTIONNAIRE' && this._innovation.quizId) {
      return this._innovation.quizId !== '';
    }
    return false;
  }

  public onAddCard(event: Event) {
    event.preventDefault();
    if (this.canAddCard && !this._isAddingCard) {
      this._showCardModal = true;
    }
  }

  /***
   * this is to create the new innovationCard and push it to the innovation.
   * @param event
   */
  public addInnovationCard(event: Event) {
    event.preventDefault();

    if (this.canAddCard && !this._isAddingCard) {
      this._isAddingCard = true;
      const _lang = this._activeInnovCard.lang === 'en' ? 'fr' : 'en';
      const _card = new InnovCard({lang: _lang});
      this._innovationService.createInnovationCard(this._innovation._id, _card).pipe(first()).subscribe((card) => {
        this._isBannerViewed = true;
        this._innovation.innovationCards.push(card);
        this._innovationFrontService.setInnovation(this._innovation);
        this._isAddingCard = false;
        this.closeModal();
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
        }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isAddingCard = false;
        console.error(err);
      });
    }

  }

  public closeModal() {
    this._showCardModal = false;
  }

  /***
   * this function is called when the user click on the Save button.
   * this is only for the Targeting page.
   * @param event
   */
  public onSaveProject(event: Event) {
    event.preventDefault();

    if (this._saveChanges && !this._isSavingProject) {
      this._isSavingProject = true;
      this._innovationService.save(this._innovation._id, this._innovation).pipe(first()).subscribe(() => {
        this._innovationFrontService.setNotifyChanges(false);
        this._isSavingProject = false;
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
        }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isSavingProject = false;
        console.error(err);
      });
    }

  }

  get canAddCard(): boolean {
    return this._activeInnovCard.lang && this._innovation.innovationCards && this._innovation.innovationCards.length === 1
      && (this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
  }

  get isDropdownLang(): boolean {
    return this._activeInnovCard.lang && this._innovation.innovationCards && this._innovation.innovationCards.length > 1;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get scrollOn(): boolean {
    return this._scrollOn;
  }

  get currentPage(): string {
    return this._currentPage;
  }

  set sidebarTemplate(value: SidebarInterface) {
    this._sidebarTemplate = value;
  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

  get innovCardToPreview(): InnovCard {
    return this._innovCardToPreview;
  }

  get showBanner(): boolean {
    return this._showBanner;
  }

  set showBanner(value: boolean) {
    this._showBanner = value;
  }

  get banner(): Banner {
    return this._banner;
  }

  get showCardModal(): boolean {
    return this._showCardModal;
  }

  set showCardModal(value: boolean) {
    this._showCardModal = value;
  }
  get isExampleAvailable(): boolean {
    return this._isExampleAvailable;
  }

  get isSavingProject(): boolean {
    return this._isSavingProject;
  }
  get saveChanges(): boolean {
    return this._saveChanges;
  }

  get activeInnovCard(): InnovCard {
    return this._activeInnovCard;
  }

  get tabs(): Array<Tab> {
    return this._tabs;
  }

  get isAddingCard(): boolean {
    return this._isAddingCard;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
