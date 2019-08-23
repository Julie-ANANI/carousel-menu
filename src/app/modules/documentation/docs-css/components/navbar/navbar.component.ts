import { Component } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-navbar',
  styleUrls: ['../../docs-css.component.scss'],
  templateUrl: './navbar.component.html'
})

export class NavbarComponent {

  toggleMenu: boolean = false;

  constructor() {
  }

  public getLogo(): string {
    return environment.logoURL;
  }

}

