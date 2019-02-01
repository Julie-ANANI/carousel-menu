/**
 * Created by bastien on 10/01/2018.
 */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TemplatesService } from '../services/templates/templates.service';

@Injectable()
export class SignatureResolver implements Resolve<any> {
  constructor(
    private _templatesService: TemplatesService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this._templatesService.getSignature(route.params.signatureId);
  }
}
