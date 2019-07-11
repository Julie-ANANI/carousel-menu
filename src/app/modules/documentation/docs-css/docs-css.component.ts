import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-docs-css',
  styleUrls: ['./docs-css.component.scss'],
  templateUrl: './docs-css.component.html'
})

export class DocsCssComponent {

  private _activeRoute: string;

  constructor(private _router: Router) {

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._activeRoute = event.urlAfterRedirects.slice(33);
      }
    });

  }

  get activeRoute(): string {
    return this._activeRoute;
  }

}

