import { Component } from '@angular/core';
import { TranslateTitleService } from "../../../services/title/title.service";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})

export class NotFoundComponent {

  constructor(private translateTitleService: TranslateTitleService) {

    this.translateTitleService.setTitle('Page Not Found');

  }

}
