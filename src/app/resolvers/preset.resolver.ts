/**
 * Created by bastien on 10/01/2018.
 */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {PresetService} from '../services/preset/preset.service';

@Injectable()
export class PresetResolver implements Resolve<any> {
  constructor(
    private _presetService: PresetService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this._presetService.get(route.params.presetId);
  }
}
