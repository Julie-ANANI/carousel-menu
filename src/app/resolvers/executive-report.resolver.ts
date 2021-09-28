import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ExecutiveReport } from '../models/executive-report';
import { ExecutiveReportService } from '../services/executive-report/executive-report.service';
import { Innovation } from '../models/innovation';

const REPORT_KEY = makeStateKey('report');

@Injectable({providedIn: 'root'})
export class ExecutiveReportResolver implements Resolve<ExecutiveReport> {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private _executiveReportService: ExecutiveReportService,
              private _transferState: TransferState) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<ExecutiveReport> {

    if (this._transferState.hasKey(REPORT_KEY)) {
      const report = this._transferState.get<ExecutiveReport>(REPORT_KEY, <ExecutiveReport>{});
      this._transferState.remove(REPORT_KEY);

      return new Observable((observer) => {
        observer.next(report);
        observer.complete();
      });

    } else {
      const innovation: Innovation = activatedRouteSnapshot.parent && activatedRouteSnapshot.parent.data
      && activatedRouteSnapshot.parent.data.innovation && typeof activatedRouteSnapshot.parent.data.innovation !== undefined
        ? activatedRouteSnapshot.parent.data.innovation : <Innovation>{};
      const reportId = activatedRouteSnapshot.paramMap.get('reportId') || innovation.executiveReportId || '';

      if (reportId) {
        return this._executiveReportService.get(reportId)
          .pipe(first(),
            tap((report) => {
              if (isPlatformServer(this.platformId)) {
                this._transferState.set(REPORT_KEY, report as ExecutiveReport);
              }
            }),
            catchError((err: HttpErrorResponse) => {
              console.error(err);
              return EMPTY;
            })
          );
      } else {
        return new Observable((observer) => {
          observer.next(<ExecutiveReport>{});
          observer.complete();
        });
      }

    }

  }
}
