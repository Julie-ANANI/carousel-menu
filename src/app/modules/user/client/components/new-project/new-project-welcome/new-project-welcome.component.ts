import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-new-project-welcome',
  templateUrl: './new-project-welcome.component.html',
  styleUrls: ['./new-project-welcome.component.scss']
})
export class NewProjectWelcomeComponent {

  constructor(private _translateService: TranslateService) { }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

}
