import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

export interface ComponentCanDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({providedIn: 'root'})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor (private _translateService: TranslateService) {}

  private _getMessage(): string {
    switch (this._translateService.currentLang) {
      case 'fr':
        return 'Souhaitez vous vraiment quitter sans savegarder? Tous vos changements seront perdus.';
      case 'en':
      default:
        return 'Do you really want to leave this page without saving? All your changes will be lost.';
    }
  }

  canDeactivate(component: ComponentCanDeactivate,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate() ?
      true :
      // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
      // when navigating away from your angular app, the browser will show a generic warning message
      // see http://stackoverflow.com/a/42207299/7307355
      confirm(this._getMessage());
  }
}
