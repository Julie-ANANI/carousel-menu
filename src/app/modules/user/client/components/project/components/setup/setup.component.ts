import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Innovation } from '../../../../../../../models/innovation';
import { first, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { InnovCard } from '../../../../../../../models/innov-card';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../../../services/error/error-front.service';
import { Mission } from '../../../../../../../models/mission';
import { MissionFrontService } from '../../../../../../../services/mission/mission-front.service';

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
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _currentPage = '';

  private _saveChanges = false;

  private _banner: Banner = <Banner>{};

  private _showBanner = false;

  private _isBannerViewed = false;

  private _activeCardIndex = 0;

  private _activeInnovCard: InnovCard = <InnovCard>{};

  private _tabs: Array<Tab> = [
    { route: 'pitch', iconClass: 'icon icon-check', name: 'PITCH', tracking: 'gtm-edit-market-targeting' },
    { route: 'targeting', iconClass: 'icon icon-check', name: 'TARGETING', tracking: 'gtm-edit-market-targeting' },
  ];

  private _showCardModal = false;

  private _isAddingCard = false;

  private _isSavingProject = false;

  private _quizExample = '';

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

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      this._initBanner();
      this._initInnovCard();
      this._quizExample = MissionFrontService.objectiveInfo(<Mission>this._innovation.mission,
        'HELP_QUIZ', this._activeInnovCard.lang);
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
    this._innovationFrontService.setActiveCardIndex(this._activeCardIndex);
    this._activeInnovCard = InnovationFrontService.activeCard(this._innovation, this._activeCardIndex);
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
    this._router.navigate([`/user/projects/${this._innovation._id}/setup/${route}`]);
  }

  /***
   * when the user clicks on the Example button to view the example of the quiz of the
   * selected objective
   * @param event
   */
  public onViewExample(event: Event) {
    event.preventDefault();
    window.open(this._quizExample, '_blank');
  }

  /***
   * this function is called when the user clicks on the Preview button.
   * @param event
   */
  public onViewPreview(event: Event) {
    event.preventDefault();
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

  get currentPage(): string {
    return this._currentPage;
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

  get quizExample(): string {
    return this._quizExample;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
