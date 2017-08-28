import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class WhitemarkService {
  private _whitemark = 'umi';

  constructor(@Inject(DOCUMENT) private _document: any) {
    this._whitemark = this._document.location.hostname;
  }

  public getLogo (): any {
    switch (this._whitemark) { // TODO remplacer par une requête au serveur
      case 'salveo':
        return {
          'url': '/assets/logos/logo-salveo-291x103.jpg',
          'width': 291,
          'height': 103
        };
      default:
        return {
          'url': '/assets/logos/logo-umi-154x48.png',
          'width': 154,
          'height': 48
        };
    }
  }

}
