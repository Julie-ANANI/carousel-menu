/**
 * Created by bastien on 10/01/2018.
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { PresetService } from '../services/preset/preset.service';
import { Preset } from '../models/preset';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const PRESET_KEY = makeStateKey('preset');

@Injectable()
export class PresetResolver implements Resolve<Preset> {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private presetService: PresetService,
              private state: TransferState) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Preset> {
    if (this.state.hasKey(PRESET_KEY)) {
      const preset = this.state.get<Preset>(PRESET_KEY, null);
      this.state.remove(PRESET_KEY);
      return new Observable((observer) => {
        observer.next(preset);
        observer.complete();
      });
    } else {
      const presetId = route.paramMap.get('presetId') || '';
      return this.presetService.get(presetId)
        .pipe(
          tap((preset) => {
            if (isPlatformServer(this.platformId)) {
              this.state.set(PRESET_KEY, preset as Preset);
            }
          }),
          catchError(() => {
            return EMPTY;
          })
        );
    }
  }
}
