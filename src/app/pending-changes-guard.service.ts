import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor (private _translateService: TranslateService) {}

  private _getMessage (): string {
    return this._translateService.currentLang === 'fr' // TODO Checker les messages :
      ? 'ATTENTION : Certaines de vos modifications n\'ont pas été sauvegardées.' +
      'Si vous quittez cette page, ces modifications seront perdues. Êtes-vous sûr(e) de vouloir quitter ?'
      : 'WARNING: Some of your modifications are unsaved. If you leave this page, theses ' +
      'changes will be lost. Are you sure you want to leave?';
  }

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate() ?
      true :
      // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
      // when navigating away from your angular app, the browser will show a generic warning message
      // see http://stackoverflow.com/a/42207299/7307355
      confirm(this._getMessage());
  }
}
