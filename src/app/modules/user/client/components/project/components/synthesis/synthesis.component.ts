import {Component, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../../models/innovation';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {InnovationFrontService} from '../../../../../../../services/innovation/innovation-front.service';

@Component({
  templateUrl: './synthesis.component.html',
  styleUrls: ['./synthesis.component.scss']
})

export class SynthesisComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
    });
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
