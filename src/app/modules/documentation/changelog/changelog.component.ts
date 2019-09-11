import { Component } from '@angular/core';
import { TranslateTitleService } from '../../../services/title/title.service';

@Component({
  selector: 'app-changelog',
  styleUrls: ['./changelog.component.scss'],
  templateUrl: './changelog.component.html'
})

export class ChangelogComponent {

  constructor(private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('Changelog | UMI');

  }

}

