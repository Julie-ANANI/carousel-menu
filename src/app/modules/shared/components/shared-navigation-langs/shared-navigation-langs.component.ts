import { Component } from '@angular/core';
import {Innovation} from '../../../../models/innovation';

@Component({
  selector: 'app-shared-navigation-langs',
  templateUrl: './shared-navigation-langs.component.html',
  styleUrls: ['./shared-navigation-langs.component.scss']
})
export class SharedNavigationLangsComponent {

  private _project: Innovation = <Innovation>{};
  private _username = 'JULIE';

  constructor() { }

  get user() {
    return this._username;
  };

  get showLangDrop(): boolean {
    return this._project.innovationCards && this._project.innovationCards.length > 1;
  }

}
