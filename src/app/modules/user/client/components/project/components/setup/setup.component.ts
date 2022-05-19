import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Innovation } from '../../../../../../../models/innovation';
import { first, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../../services/translate-notifications/translate-notifications.service';
import { InnovCard } from '../../../../../../../models/innov-card';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../../../services/error/error-front.service';
import { Mission } from '../../../../../../../models/mission';
import { MissionFrontService } from '../../../../../../../services/mission/mission-front.service';
import { environment } from '../../../../../../../../environments/environment';
import { CanComponentDeactivate } from '../../../../../../../guards/can-deactivate-guard.service';
import { RouteFrontService } from '../../../../../../../services/route/route-front.service';
import { picto, Picto } from '../../../../../../../models/static-data/picto';
import { Language } from "../../../../../../../models/static-data/language";

interface Banner {
  message: string;
  background: string;
}

interface Tab {
  route: string;
  name: string;
  tracking: string;
}

interface Save {
  key: string;
  state: boolean;
}

@Component({
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  get pictos(): Picto {
    return this._pictos;
  }

  get canAddCard(): boolean {
    return this._canAddCard;
  }

  get hasDropdownLang(): boolean {
    return this._hasDropdownLang;
  }

  private _innovation: Innovation = <Innovation>{};

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _currentPage = '';

  private _saveChanges: Save = <Save>{};

  private _activeSaveBadge = false;

  private _banner: Banner = <Banner>{};

  private _showBanner = false;

  private _isBannerViewed = false;

  private _activeCardIndex = 0;

  private _activeInnovCard: InnovCard = <InnovCard>{};

  private _innoCardLanguages: Array<Language> = [];

  private _languageSelected: Language;

  private _tabs: Array<Tab> = [
    {route: 'pitch', name: 'PITCH', tracking: 'gtm-edit-market-targeting'},
    {route: 'targeting', name: 'TARGETING', tracking: 'gtm-edit-market-targeting'},
  ];

  private _showCardModal = false;

  private _isAddingCard = false;

  private _isSavingProject = false;

  private _quizExample = '';

  private _previewLink = '';

  private _scrollOn = false;

  private _hasDropdownLang = false;

  private _canAddCard = false;

  private _pictos: Picto = picto;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _router: Router,
              private _routeFrontService: RouteFrontService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) {
  }

  ngOnInit() {
    this._getCurrentPage();

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._getCurrentPage();
      }
    });

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      if (innovation && innovation._id) {
        this._innovation = innovation;
        this._previewLink = `${environment.quizUrl}/quiz/${innovation._id}/preview`;
        this._initBanner();
        this._initInnovCard();

        this._initInnoCardLanguage();

        this._hasDropdownLang = this._activeInnovCard.lang && this._innovation.innovationCards
          && this._innovation.innovationCards.length > 1;

        this._canAddCard = this._activeInnovCard.lang && this._innovation.innovationCards
          && this._innovation.innovationCards.length === 1
          && (this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');

        this._quizExample = MissionFrontService.objectiveInfo(<Mission>this._innovation.mission,
          'HELP_QUIZ', this._activeInnovCard.lang);
      }
    });

    this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._saveChanges = response;
      if (response && response.key === 'settings') {
        this._activeSaveBadge = response && response.state;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this._scrollOn = window.pageYOffset > 50 || window.scrollY > 50;
  }

  private _getCurrentPage() {
    this._currentPage = this._routeFrontService.activeTab(6, 5).toUpperCase() || 'PITCH';
  }

  private _initBanner() {
    if (!this._isBannerViewed) {
      this._banner.background = this._innovation.status === 'DONE' ? 'bg-success text-white' : 'bg-warning text-white';
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

  // TODO: refactor
  private _initInnoCardLanguage() {
    this._innoCardLanguages = [];
    if (this._innovation && this._innovation.innovationCards && this._innovation.innovationCards.length) {
      this._innovation.innovationCards.map(innoCard => {
        if (!innoCard['hidden']) {
          const language = {
            type: innoCard.lang
          };
          language['hidden'] = innoCard['hidden'];
          language['status'] = innoCard['status'] || 'EDITING';
          this._innoCardLanguages.push(language);
        }
      })
      this._languageSelected = this._innoCardLanguages.length > 0 && this._innoCardLanguages[0];
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

  public onAddCard(event: Event) {
    event.preventDefault();
    if (this._canAddCard && !this._isAddingCard) {
      this._showCardModal = true;
    }
  }

  private _emitUpdatedInnovation() {
    this._innovationFrontService.setInnovation(JSON.parse(JSON.stringify(this._innovation)));
  }

  /***
   * this is to create the new innovationCard and push it to the innovation.
   * @param event
   */
  public addInnovationCard(event: Event) {
    event.preventDefault();

    if (this._canAddCard && !this._isAddingCard) {
      this._isAddingCard = true;
      const _lang = this._activeInnovCard.lang === 'en' ? 'fr' : 'en';
      const _card = new InnovCard({lang: _lang});
      this._innovationService.createInnovationCard(this._innovation._id, _card).pipe(first()).subscribe((card) => {
        this._isBannerViewed = true;
        this._innovation.innovationCards.push(card);
        this._emitUpdatedInnovation();
        this._isAddingCard = false;
        this.closeModal();
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        this._isAddingCard = false;
        console.error(err);
      });
    }

  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return !this._activeSaveBadge;
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

    if (this._saveChanges.state && !this._isSavingProject) {
      this._isSavingProject = true;
      this._innovationService.save(this._innovation._id, {settings: this._innovation.settings})
        .pipe(first()).subscribe(() => {
        this._isSavingProject = false;
        this._saveChanges.state = false;
        this._innovationFrontService.setNotifyChanges(this._saveChanges);
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        this._isSavingProject = false;
        console.error(err);
      });
    }
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

  get saveChanges(): Save {
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

  get previewLink(): string {
    return this._previewLink;
  }

  get scrollOn(): boolean {
    return this._scrollOn;
  }

  get activeSaveBadge(): boolean {
    return this._activeSaveBadge;
  }


  get languageSelected(): Language {
    return this._languageSelected;
  }

  get innoCardLanguages(): Array<Language> {
    return this._innoCardLanguages;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  // TODO
  selectLanguage(event: Event, language: Language) {
    event.preventDefault();
    this._languageSelected = language;
  }
}
