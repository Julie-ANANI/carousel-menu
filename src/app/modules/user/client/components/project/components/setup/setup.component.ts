import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Innovation } from '../../../../../../../models/innovation';
import { ScrollService } from '../../../../../../../services/scroll/scroll.service';
import {first, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { InnovationSettings } from '../../../../../../../models/innov-settings';
import {InnovationCommonService} from '../../../../../../../services/innovation/innovation-common.service';
import {InnovationService} from '../../../../../../../services/innovation/innovation.service';
import {TranslateNotificationsService} from '../../../../../../../services/notifications/notifications.service';

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

  constructor(private scrollService: ScrollService,
              private router: Router,
              private innovationCommonService: InnovationCommonService,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {

    this.initializeVariables();

    this.getCurrentPage();

    this.scrollService.getScrollValue().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.scrollOn = value > 50;
      console.log(value);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getCurrentPage();
      }
    });

    this.innovationCommonService.getNotifyChanges().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      this.saveChanges = response;
    });

    console.log(this.innovation);

    console.log(this.saveChanges);

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


  setCurrentTab(event: Event, value: string) {
    event.preventDefault();
    this.currentPage = value;
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

    this.innovationService.save(this.innovation._id, this.innovation).pipe(first()).subscribe((response: Innovation) => {
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
      this.innovation.innovationCards = value.innovationCards;
      this.buttonSaveClass = 'save-active';
    }
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
