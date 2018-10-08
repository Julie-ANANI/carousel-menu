import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

export interface ComponentCanDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor (private _translateService: TranslateService) {}

  private _getMessage (): string {
    switch (this._translateService.currentLang) {
      case 'fr':
        return 'ATTENTION : Certaines de vos modifications n\'ont pas été sauvegardées.' +
          'Si vous quittez cette page, ces modifications seront perdues. Êtes-vous sûr(e) de vouloir quitter ?';
      case 'en':
      default:
        return 'WARNING: Some of your modifications are not saved. If you leave this page, these ' +
          'changes will be lost. Are you sure you want to leave?';
    }
  }

  canDeactivate(component: ComponentCanDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate() ?
      true :
      // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
      // when navigating away from your angular app, the browser will show a generic warning message
      // see http://stackoverflow.com/a/42207299/7307355
      confirm(this._getMessage());
  }
}
