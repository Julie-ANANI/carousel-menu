import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Innovation } from '../../../../../../../models/innovation';
import { ScrollService } from '../../../../../../../services/scroll/scroll.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { InnovationSettings } from '../../../../../../../models/innov-settings';
import { InnovationCommonService } from '../../../../../../../services/innovation/innovation-common.service';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import {SidebarInterface} from '../../../../../../sidebar/interfaces/sidebar-interface';
import {Media} from '../../../../../../../models/media';
import {InnovCard} from '../../../../../../../models/innov-card';

@Component({
  selector: 'app-setup',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})

export class SetupComponent implements OnInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this.innovation = value;
  }

  innovation: Innovation;

  selectedInnovationIndex: number;

  scrollOn: boolean;

  ngUnsubscribe: Subject<any> = new Subject();

  currentPage: string;

  saveChanges: boolean;

  buttonSaveClass: string;

  sidebarValue: SidebarInterface = {};

  constructor(private scrollService: ScrollService,
              private router: Router,
              private innovationCommonService: InnovationCommonService,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.initializeVariables();

    this.getCurrentPage();

    this.scrollService.getScrollValue().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.scrollOn = value > 50;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getCurrentPage();
      }
    });

    this.innovationCommonService.getNotifyChanges().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      this.saveChanges = response;
    });

    this.innovationCommonService.getSelectedInnovationIndex().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: number) => {
      this.selectedInnovationIndex = response;
    });

    console.log(this.innovation);
  }


  private initializeVariables() {
    this.scrollOn = false;
    this.selectedInnovationIndex = 0;
    this.saveChanges = false;
    this.buttonSaveClass = 'save-disabled';
  }


  private getCurrentPage() {
    const url = this.router.routerState.snapshot.url.split('/');
    this.currentPage = url.length > 0 ? url[5] : 'targeting';
  }


  /***
   * this function will activate the tab and user has to save all the changes
   * before going to another page.
   * @param event
   * @param value
   */
  setCurrentTab(event: Event, value: string) {
    event.preventDefault();

    if (!this.saveChanges) {
      this.currentPage = value;
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

    this.sidebarValue = {
      animate_state: this.sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'PROJECT_MODULE.SETUP.PREVIEW',
      size: '726px'
    };

  }


  closeSidebar(value: SidebarInterface) {
    this.sidebarValue.animate_state = value.animate_state;
  }


  /***
   * this function is called when the user wants to save the innovation changes.
   * @param event
   */
  onClickSave(event: Event) {
    event.preventDefault();

    this.innovationCommonService.completionCalculation(this.innovation);

    const percentages = this.innovationCommonService.calculatedPercentages;

    if (percentages) {
      this.innovation.settings.completion = percentages.settingPercentage;
      this.innovation.completion = percentages.totalPercentage;
      percentages.innovationCardsPercentage.forEach((item: any) => {
        const index = this.innovation.innovationCards.findIndex(card => card.lang === item.lang);
        this.innovation.innovationCards[index].completion = item.percentage;
      });
    }

    this.innovationService.save(this.innovation._id, this.innovation).subscribe((response: Innovation) => {
      this.innovation = response;
      this.buttonSaveClass = 'save-disabled';
      this.innovationCommonService.setNotifyChanges(false);
      this.translateNotificationsService.success('ERROR.PROJECT.SAVED', 'ERROR.PROJECT.SAVED_TEXT');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  /*
      Here we are receiving the value from the targeting form.
   */
  updateSettings(value: InnovationSettings): void {
    if (this.innovation.status === 'EDITING' || this.innovation.status === 'SUBMITTED') {
      this.innovation.settings = value;
      this.buttonSaveClass = 'save-active';
    }
  }


  /*
     Here we are checking if there are any changes in the pitch form.
  */
  updatePitch(value: Innovation) {
    if (this.innovation.status === 'EDITING' || this.innovation.status === 'SUBMITTED') {
      this.innovation = value;
      this.buttonSaveClass = 'save-active';
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


  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
