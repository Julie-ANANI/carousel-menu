import { Component, HostListener, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Innovation } from '../../../../../../../models/innovation';
import { first, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { SidebarInterface } from '../../../../../../sidebars/interfaces/sidebar-interface';
import { InnovCard } from '../../../../../../../models/innov-card';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-setup',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupComponent implements OnInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this._innovation = value;
    this._canEdit = value.status === 'EDITING';
  }

  private _innovation: Innovation;

  private _selectedInnovationIndex = 0;

  private _scrollOn = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _currentPage: string;

  private _saveChanges = false;

  private _buttonSaveClass = 'save-disabled';

  private _sidebarValue: SidebarInterface = {};

  private _submitModal = false;

  private _canEdit = false;

  private _innovationToView: InnovCard = <InnovCard>{};

  private _innovationExample: Innovation = <Innovation>{};

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private router: Router,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService,
              private activatedRoute: ActivatedRoute,
              private innovationFrontService: InnovationFrontService) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getCurrentPage();
      }
    });

    this.innovationFrontService.getSelectedInnovationIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response: number) => {
      this._selectedInnovationIndex = response;
    });

    this.innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._saveChanges = response;
      if (this._saveChanges) {
        this._buttonSaveClass = 'save-active';
      }
    });

  }

  ngOnInit() {
    this.getCurrentPage();
    this._getExampleInnovation();
  }


  private getCurrentPage() {
    const url = this.router.routerState.snapshot.url.split('/');
    this._currentPage = url.length > 0 ? url[5] : 'pitch';
  }

  private _getExampleInnovation() {
    if (isPlatformBrowser(this._platformId)) {
      this.innovationService.get('5dbb0b0f07eacfdfae0e2aa1').pipe(first()).subscribe((response) => {
        this._innovationExample = response;
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


  /***
   * this function will activate the tab and user has to save all the changes
   * before going to another page.
   * @param event
   * @param value
   */
  setCurrentTab(event: Event, value: string) {
    event.preventDefault();

    if (!this._saveChanges) {
      this._currentPage = value;
      this.router.navigate(['setup', value], {relativeTo: this.activatedRoute});
    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    }

  }

  public onClickExample(event: Event) {
    event.preventDefault();

    const lang = this._innovation.innovationCards[this._selectedInnovationIndex].lang;
    const index = this._innovationExample.innovationCards.findIndex((card) => card.lang === lang);

    if (index !== -1) {
      this._innovationToView = this._innovationExample.innovationCards[index];
    }

    this._sidebarValue = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.EXAMPLE',
      size: '726px'
    };

  }


  /***
   * this function is called when the user wants to print the innovation.
   * @param event
   */
  onClickPrint(event: Event) {
    event.preventDefault();
    window.print();
  }


  /***
   * this function is called when the user wants to preview the innovation card.
   * @param event
   */
  onClickPreview(event: Event) {
    event.preventDefault();

    this._innovationToView = this._innovation.innovationCards[this._selectedInnovationIndex];

    this._sidebarValue = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.PREVIEW',
      size: '726px'
    };

  }


  /***
   * this function is called when the user wants to save the innovation changes.
   * @param event
   */
  onClickSave(event: Event) {
    event.preventDefault();

    if (this._saveChanges) {

      this.innovationFrontService.completionCalculation(this._innovation);
      const percentages = this.innovationFrontService.calculatedPercentages;

      if (percentages) {
        this._innovation.settings.completion = percentages.settingPercentage;
        this._innovation.completion = percentages.totalPercentage;
        percentages.innovationCardsPercentage.forEach((item: any) => {
          const index = this._innovation.innovationCards.findIndex(card => card.lang === item.lang);
          this._innovation.innovationCards[index].completion = item.percentage;
        });
      }

      this.innovationService.save(this._innovation._id, this._innovation).subscribe(() => {
        this._buttonSaveClass = 'save-disabled';
        this.innovationFrontService.setNotifyChanges(false);
        this.translateNotificationsService.success('ERROR.PROJECT.SAVED', 'ERROR.PROJECT.SAVED_TEXT');
        }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });

    }

  }


  /***
   * this function is called when the user wants to submit his project,
   * we also checked he saved the project or not then open the confirmation modal.
   */
  onClickSubmit() {
    if (!this._saveChanges) {
      this._submitModal = true;
    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    }
  }


  /***
   * this function is called when the user clicks on the confirm button of the submit
   * modal.
   */
  onClickConfirm() {
    this.innovationService.save(this._innovation._id, {status: 'SUBMITTED'}).subscribe((response: Innovation) => {
      this.router.navigate(['user/projects']);
      this.translateNotificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
      }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  getImageSrc(innovCard: InnovCard): string {
    return InnovationFrontService.getMediaSrc(innovCard, 'default', '180', '119');
  }


  getPitchCompletion(innovation: Innovation): number {
    let total = 0;
    innovation.innovationCards.forEach((innovationCard: InnovCard) => {
      total += innovationCard.completion;
    });
    return (total/innovation.innovationCards.length);
  }


  get innovation(): Innovation {
    return this._innovation;
  }

  get selectedInnovationIndex(): number {
    return this._selectedInnovationIndex;
  }

  get scrollOn(): boolean {
    return this._scrollOn;
  }

  get currentPage(): string {
    return this._currentPage;
  }

  get buttonSaveClass(): string {
    return this._buttonSaveClass;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set submitModal(value: boolean) {
    this._submitModal = value;
  }

  get submitModal(): boolean {
    return this._submitModal;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

  get innovationToView(): InnovCard {
    return this._innovationToView;
  }

  get innovationExample(): Innovation {
    return this._innovationExample;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
