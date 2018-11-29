import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../../models/innovation';
import {ScrollService} from '../../../../../../../services/scroll/scroll.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';


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

  constructor(private scrollService: ScrollService) { }

  ngOnInit() {
    this.scrollService.getScrollValue().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.scrollOn = value > 50;
      console.log(this.scrollOn);
    });
    console.log(this.innovation);

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
