import {Component, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../../models/innovation';
import {takeUntil} from 'rxjs/operators';
import {InnovationFrontService} from '../../../../../../../services/innovation/innovation-front.service';
import {Subject} from 'rxjs';

@Component({
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  get innovation(): Innovation {
    return this._innovation;
  }

  private _innovation: Innovation = <Innovation>{};

  private _subscribe: Subject<any> = new Subject<any>();

  constructor(private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._subscribe)).subscribe((innovation) => {
      this._innovation = innovation;
    });
  }

  ngOnDestroy(): void {
    this._subscribe.next();
    this._subscribe.complete();
  }

}
