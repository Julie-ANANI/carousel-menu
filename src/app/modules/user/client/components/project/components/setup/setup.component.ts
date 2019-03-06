import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Innovation } from '../../../../../../../models/innovation';
import { ScrollService } from '../../../../../../../services/scroll/scroll.service';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { InnovationSettings } from '../../../../../../../models/innov-settings';
import { InnovationCommonService } from '../../../../../../../services/innovation/innovation-common.service';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { SidebarInterface } from '../../../../../../sidebar/interfaces/sidebar-interface';
import { Media } from '../../../../../../../models/media';
import { InnovCard } from '../../../../../../../models/innov-card';

@Component({
  selector: 'app-setup',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupComponent implements OnInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  private _innovation: Innovation;

  private _selectedInnovationIndex: number;

  private _scrollOn: boolean;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _currentPage: string;

  private _saveChanges: boolean;

  private _buttonSaveClass: string;

  private _sidebarValue: SidebarInterface = {};

  private _submitModal: boolean;

  constructor(private scrollService: ScrollService,
              private router: Router,
              private innovationCommonService: InnovationCommonService,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.initializeVariables();

    this.getCurrentPage();

    this.scrollService.getScrollValue().pipe(takeUntil(this._ngUnsubscribe)).subscribe((value) => {
      this._scrollOn = value > 50;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getCurrentPage();
      }
    });

    this.innovationCommonService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._saveChanges = response;
    });

    this.innovationCommonService.getSelectedInnovationIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response: number) => {
      this._selectedInnovationIndex = response;
    });

  }


  private initializeVariables() {
    this._scrollOn = false;
    this._selectedInnovationIndex = 0;
    this._saveChanges = false;
    this._submitModal = false;
    this._buttonSaveClass = 'save-disabled';
  }


  private getCurrentPage() {
    const url = this.router.routerState.snapshot.url.split('/');
    this._currentPage = url.length > 0 ? url[5] : 'targeting';
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

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
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
      this.innovationCommonService.completionCalculation(this._innovation);

      const percentages = this.innovationCommonService.calculatedPercentages;

      if (percentages) {
        this._innovation.settings.completion = percentages.settingPercentage;
        this._innovation.completion = percentages.totalPercentage;
        percentages.innovationCardsPercentage.forEach((item: any) => {
          const index = this._innovation.innovationCards.findIndex(card => card.lang === item.lang);
          this._innovation.innovationCards[index].completion = item.percentage;
        });
      }

      this.innovationService.save(this._innovation._id, this._innovation).subscribe((response: Innovation) => {
        this._innovation = response;
        this._buttonSaveClass = 'save-disabled';
        this.innovationCommonService.setNotifyChanges(false);
        this.translateNotificationsService.success('ERROR.PROJECT.SAVED', 'ERROR.PROJECT.SAVED_TEXT');
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });
    }

  }


  /***
   * this function is called when the user wants to submit his project,
   * we also checked he saved the project or not then open the confirmation modal.
   * @param event
   */
  onClickSubmit(event: Event) {
    event.preventDefault();

    if (!this._saveChanges) {
      this._submitModal = true;
    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    }

  }


  closeModal(event: Event) {
    event.preventDefault();
    this._submitModal = false;
  }


  /***
   * this function is called when the user clicks on the confirm button of the submit
   * modal.
   * @param event
   */
  onClickConfirm(event: Event) {
    event.preventDefault();

    this.innovationService.submitProjectToValidation(this._innovation._id).pipe(first()).subscribe((response: Innovation) => {
      this._innovation.status = 'SUBMITTED';
      this.router.navigate(['user/projects']);
      this.translateNotificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SUBMITTED_TEXT');
      }, () => {
      this.closeModal(event);
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });

  }


  /*
      Here we are receiving the value from the targeting form.
   */
  updateSettings(value: InnovationSettings): void {
    if (this._innovation.status === 'EDITING') {
      this._innovation.settings = value;
      this._buttonSaveClass = 'save-active';
    }
  }


  /*
     Here we are checking if there are any changes in the pitch form.
  */
  updatePitch(value: Innovation) {
    if (this._innovation.status === 'EDITING') {
      this._innovation = value;
      this._buttonSaveClass = 'save-active';
    }
  }


  getImageSrc(innovCard: InnovCard): string {

    let src = '';
    const defaultSrc = 'https://res.cloudinary.com/umi/image/upload/v1535383716/app/default-images/image-not-available.png';

    if (innovCard.principalMedia && innovCard.principalMedia.type === 'PHOTO') {
      src = innovCard.principalMedia.url;
    } else {
      if (innovCard.media) {
        const index = innovCard.media.findIndex((media: Media) => media.type === 'PHOTO');
        if (index !== -1) {
          src = innovCard.media[index].url;
        }
      }
    }

    if (src === '') {
      src = defaultSrc;
    }

    return src;

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

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  get currentPage(): string {
    return this._currentPage;
  }

  get saveChanges(): boolean {
    return this._saveChanges;
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

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
