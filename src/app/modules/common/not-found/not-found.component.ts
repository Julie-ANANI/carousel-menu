import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from "../../../services/title/title.service";

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})

export class NotFoundComponent implements OnInit {

  constructor(private translateTitleService: TranslateTitleService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('Page Not Found');
  }

}
