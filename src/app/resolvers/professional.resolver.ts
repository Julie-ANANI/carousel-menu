import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Professional } from '../models/professional';
import { ProfessionalsService } from '../services/professionals/professionals.service';

const PROFESSIONAL_KEY = makeStateKey('professional');

@Injectable()
export class ProfessionalResolver implements Resolve<Professional> {

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _professionalService: ProfessionalsService,
              private _transferState: TransferState) {}

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Professional> {

    if (this._transferState.hasKey(PROFESSIONAL_KEY)) {

      const professional = this._transferState.get<Professional>(PROFESSIONAL_KEY, null);
      this._transferState.remove(PROFESSIONAL_KEY);

      return new Observable((observer) => {
        observer.next(professional);
        observer.complete();
      });

    } else {
      const professionalId = activatedRouteSnapshot.paramMap.get('memberId') || '';

      return this._professionalService.get(professionalId).pipe(
          tap((response) => {
            if (isPlatformServer(this._platformId)) {
              this._transferState.set(PROFESSIONAL_KEY, response as Professional);
            }
          }),
          catchError(() => {
            return EMPTY;
          })
        );
    }

  }

}
