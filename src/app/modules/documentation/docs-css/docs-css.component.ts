import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateTitleService } from '../../../services/title/title.service';

@Component({
  selector: 'app-docs-css',
  styleUrls: ['./docs-css.component.scss'],
  templateUrl: './docs-css.component.html'
})

export class DocsCssComponent {

  private _activeRoute: string;

  constructor(private _router: Router,
              private _translateTitleService: TranslateTitleService) {

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.split('/');
        this._activeRoute = url[url.length - 1];
        this._translateTitleService.setTitle(`${this._activeRoute[0].toUpperCase()}${this._activeRoute.slice(1)} | UMI`);
      }
    });

  }

  get activeRoute(): string {
    return this._activeRoute;
  }

}

