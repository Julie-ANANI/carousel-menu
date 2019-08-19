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

    this._translateTitleService.setTitle('UMI | Documentation');

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._activeRoute = event.urlAfterRedirects.slice(31);
      }
    });

  }

  get activeRoute(): string {
    return this._activeRoute;
  }

}

