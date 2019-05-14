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

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private professionalService: ProfessionalsService,
              private state: TransferState) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Professional> {
    if (this.state.hasKey(PROFESSIONAL_KEY)) {
      const professional = this.state.get<Professional>(PROFESSIONAL_KEY, null);
      this.state.remove(PROFESSIONAL_KEY);
      return new Observable((observer) => {
        observer.next(professional);
        observer.complete();
      });
    } else {
      const professionalId = route.paramMap.get('memberId') || '';
      return this.professionalService.get(professionalId)
        .pipe(
          tap((professional) => {
            if (isPlatformServer(this.platformId)) {
              this.state.set(PROFESSIONAL_KEY, professional as Professional);
            }
          }),
          catchError(() => {
            return EMPTY;
          })
        );
    }
  }
}
