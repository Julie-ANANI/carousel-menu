import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../../models/innovation';
import {ScrollService} from '../../../../../../../services/scroll/scroll.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';


// const DEFAULT_TAB = 'targeting';

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
    this.scrollService.getScrollValue().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.scrollOn = value > 50;
      console.log(this.scrollOn);
    });

    const url = this.router.routerState.snapshot.url.split('/');
    this.currentPage = url.length > 0 ? url[5] : 'targeting';


    console.log(this.innovation);

  }


  setCurrentTab(event: Event, value: string) {
    event.preventDefault();
    this.currentPage = value;
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
