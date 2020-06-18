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

@Component({
  selector: 'app-project-setup',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupComponent implements OnInit, OnDestroy {

  /*@Input() set project(value: Innovation) {
    this._innovation = value;
    this._canEdit = value.status === 'EDITING';
  }*/

  private _innovation: Innovation = <Innovation>{};

  // private _selectedInnovationIndex = 0;

  private _scrollOn = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _currentPage = '';

  private _saveChanges = false;

  // private _buttonSaveClass = 'save-disabled';

  private _sidebarTemplate: SidebarInterface = <SidebarInterface>{
    animate_state: 'inactive',
    title: 'SIDEBAR.TITLE.PREVIEW',
    size: '726px'
  };

  // private _submitModal = false;

  // private _canEdit = false;

  private _innovCardToPreview: InnovCard = <InnovCard>{};

  private _innovationExample: Innovation = <Innovation>{};

  private _banner: Banner = <Banner>{};

  private _showBanner = false;

  private _isBannerViewed = false;

  activeCardIndex = 0;

  activeInnovCard: InnovCard = <InnovCard>{};

  tabs: Array<{route: string, iconClass: string, name: string, tracking: string}> = [
    { route: 'setup/pitch', iconClass: 'icon icon-check', name: 'PITCH_TAB', tracking: 'gtm-edit-market-targeting' },
    { route: 'setup/targeting', iconClass: 'icon icon-check', name: 'TARGETING_TAB', tracking: 'gtm-edit-market-targeting' },
    { route: 'setup/survey', iconClass: 'icon icon-check', name: 'SURVEY_TAB', tracking: 'gtm-edit-market-targeting' },
  ];

  isExampleAvailable = false;

  showCardModal = false;

  isAddingCard = false;

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

    /*this._innovationFrontService.getSelectedInnovationIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response: number) => {
      this._selectedInnovationIndex = response;
    });*/

    /*this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._saveChanges = response;
      if (this._saveChanges) {
        this._buttonSaveClass = 'save-active';
      }
    });*/

  }

  ngOnInit() {
    this._getCurrentPage();
    this._getExampleInnovation();

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      this._initBanner();
      this._initInnovCard();
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
        this.isExampleAvailable =  this._innovationExample.innovationCards && this._innovationExample.innovationCards.length !== 0;
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
      return 'PROJECT_MODULE.SETUP.BANNER_MESSAGES.REVIEWING';
    } else if (this._innovation.status === 'SUBMITTED') {
      return 'PROJECT_MODULE.SETUP.BANNER_MESSAGES.SUBMITTED';
    } else if (this._innovation.status === 'EVALUATING') {
      return 'PROJECT_MODULE.SETUP.BANNER_MESSAGES.EVALUATING';
    } else if (this._innovation.status === 'DONE') {
      return 'PROJECT_MODULE.SETUP.BANNER_MESSAGES.DONE';
    } else {
      return '';
    }
  }

  private _initInnovCard() {
    if (this._innovation.innovationCards && this._innovation.innovationCards.length) {
      this.activeInnovCard = this._innovation.innovationCards[this.activeCardIndex];
    }
  }

  public onChangeLang(event: Event) {
    event.preventDefault();
    if (this._innovation.innovationCards && this._innovation.innovationCards.length > 1) {
      this.activeCardIndex = this.activeCardIndex === 0 ? 1 : 0;
      this._initInnovCard();
    }
  }

  /***
   * this function will activate the tab and user has to save all the changes
   * before going to another page.
   * @param event
   * @param route
   */
  public navigateTo(event: Event, route: string) {
    event.preventDefault();

    if (!this._saveChanges) {
      this._router.navigate([`/user/projects/${this._innovation._id}/${route}`]);
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    }

  }

  public onViewExample(event: Event) {
    event.preventDefault();

    const _lang = this._innovation.innovationCards[this.activeCardIndex].lang;
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
    this._innovCardToPreview = this._innovation.innovationCards[this.activeCardIndex];
    this._sidebarTemplate = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.PREVIEW',
      size: '726px'
    };
  }

  public isComplete(tabName: string) {
    if (tabName === 'PITCH_TAB' && this._innovation.innovationCards && this._innovation.innovationCards.length) {
      let total = 0;
      this._innovation.innovationCards.forEach((innovationCard: InnovCard) => {
        total += innovationCard.completion;
      });
      return (total / this._innovation.innovationCards.length) === 100;
    } else if (tabName === 'TARGETING_TAB' && this._innovation.settings && this._innovation.settings.completion) {
      return this._innovation.settings.completion === 100;
    } else if (tabName === 'SURVEY_TAB' && this._innovation.quizId) {
      return this._innovation.quizId !== '';
    }
    return false;
  }

  public onAddCard(event: Event) {
    event.preventDefault();
    if (this.canAddCard && !this.isAddingCard) {
      this.showCardModal = true;
    }
  }

  /***
   * this is to create the new innovationCard and push it to the innovation.
   * @param event
   */
  public addInnovationCard(event: Event) {
    event.preventDefault();

    if (this.canAddCard && !this.isAddingCard) {
      this.isAddingCard = true;
      const _lang = this.activeInnovCard.lang === 'en' ? 'fr' : 'en';
      const _card = new InnovCard({lang: _lang});
      this._innovationService.createInnovationCard(this._innovation._id, _card).pipe(first()).subscribe((innovationCard) => {
        this._isBannerViewed = true;
        this._innovation.innovationCards.push(innovationCard);
        this._innovationFrontService.setInnovation(this._innovation);
        this.isAddingCard = false;
        this.closeModal();
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
        }, (err: HttpErrorResponse) => {
        this.isAddingCard = false;
        console.error(err);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      });
    }

  }

  public closeModal() {
    this.showCardModal = false;
  }

  /***
   * this function is called when the user wants to save the innovation changes.
   * @param event
   */
  /*onClickSave(event: Event) {
    event.preventDefault();

    if (this._saveChanges) {

      this._innovationFrontService.completionCalculation(this._innovation);
      const percentages = this._innovationFrontService.calculatedPercentages;

      if (percentages) {
        this._innovation.settings.completion = percentages.settingPercentage;
        this._innovation.completion = percentages.totalPercentage;
        percentages.innovationCardsPercentage.forEach((item: any) => {
          const index = this._innovation.innovationCards.findIndex(card => card.lang === item.lang);
          this._innovation.innovationCards[index].completion = item.percentage;
        });
      }

      this._innovationService.save(this._innovation._id, this._innovation).subscribe(() => {
        this._buttonSaveClass = 'save-disabled';
        this._innovationFrontService.setNotifyChanges(false);
        this._translateNotificationsService.success('ERROR.PROJECT.SAVED', 'ERROR.PROJECT.SAVED_TEXT');
        }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });

    }

  }*/


  /***
   * this function is called when the user wants to submit his project,
   * we also checked he saved the project or not then open the confirmation modal.
   */
  /*onClickSubmit() {
    if (!this._saveChanges) {
      this._submitModal = true;
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    }
  }*/


  /***
   * this function is called when the user clicks on the confirm button of the submit
   * modal.
   */
  /*onClickConfirm() {
    this._innovationService.save(this._innovation._id, {status: 'SUBMITTED'}).subscribe((response: Innovation) => {
      this._router.navigate(['user/projects']);
      this._translateNotificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
      }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }*/

  /*getImageSrc(innovCard: InnovCard): string {
    return InnovationFrontService.getMediaSrc(innovCard, 'default', '180', '119');
  }*/

  get canAddCard(): boolean {
    return this.activeInnovCard.lang && this._innovation.innovationCards && this._innovation.innovationCards.length === 1
      && (this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
  }

  get isDropdownLang(): boolean {
    return this.activeInnovCard.lang && this._innovation.innovationCards && this._innovation.innovationCards.length > 1;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  /*get selectedInnovationIndex(): number {
    return this._selectedInnovationIndex;
  }*/

  get scrollOn(): boolean {
    return this._scrollOn;
  }

  get currentPage(): string {
    return this._currentPage;
  }

  /*get buttonSaveClass(): string {
    return this._buttonSaveClass;
  }*/

  set sidebarTemplate(value: SidebarInterface) {
    this._sidebarTemplate = value;
  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

  /*set submitModal(value: boolean) {
    this._submitModal = value;
  }*/

  /*get submitModal(): boolean {
    return this._submitModal;
  }*/

  /*get canEdit(): boolean {
    return this._canEdit;
  }*/

  get innovCardToPreview(): InnovCard {
    return this._innovCardToPreview;
  }

  get innovationExample(): Innovation {
    return this._innovationExample;
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

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
