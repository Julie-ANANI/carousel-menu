import { Component } from '@angular/core';

@Component({
  selector: 'app-shared-navigation-langs',
  templateUrl: './shared-navigation-langs.component.html',
  styleUrls: ['./shared-navigation-langs.component.scss']
})
export class SharedNavigationLangsComponent {

  constructor() { }

  private _username = 'JULIE';

  get user() {
    return this._username;
  };

}
