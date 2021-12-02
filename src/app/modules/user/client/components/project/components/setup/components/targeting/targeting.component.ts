import {Component, OnDestroy, OnInit} from '@angular/core';
import {InnovationFrontService} from '../../../../../../../../../services/innovation/innovation-front.service';
import {CanComponentDeactivate} from '../../../../../../../../../guards/can-deactivate-guard.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  templateUrl: './targeting.component.html',
  styleUrls: ['./targeting.component.scss']
})

export class TargetingComponent implements OnInit, CanComponentDeactivate, OnDestroy {

  private _changesSaved = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _innovationFrontService: InnovationFrontService) { }

  ngOnInit(): void {
    this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((value) => {
      if (value && value.key === 'settings') {
        this._changesSaved = value && value.state;
      }
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return !this._changesSaved;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
