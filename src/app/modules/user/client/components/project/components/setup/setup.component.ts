import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Innovation } from '../../../../../../../models/innovation';
import { ScrollService } from '../../../../../../../services/scroll/scroll.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { InnovationSettings } from '../../../../../../../models/innov-settings';

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

  selectedInnovationIndex = 0;

  scrollOn = false;

  ngUnsubscribe: Subject<any> = new Subject();

  currentPage: string;

  constructor(private scrollService: ScrollService,
              private router: Router) { }

  ngOnInit() {
    this.getCurrentPage();

    this.scrollService.getScrollValue().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.scrollOn = value > 50;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getCurrentPage();
      }
    });

    console.log(this.innovation);

  }


  private getCurrentPage() {
    const url = this.router.routerState.snapshot.url.split('/');
    this.currentPage = url.length > 0 ? url[5] : 'targeting';
  }


  setCurrentTab(event: Event, value: string) {
    event.preventDefault();
    this.currentPage = value;
  }


  /*
      Here we are receiving the value from the targeting form.
   */
  updateSettings(value: InnovationSettings): void {
    this.innovation.settings = value;
  }


  /*
     Here we are checking if there are any changes in the pitch form.
  */
  updatePitch(value: Innovation) {
    this.innovation.innovationCards = value.innovationCards;
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
