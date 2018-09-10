import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})

export class NotFoundPageComponent implements OnInit {

  constructor(private translateTitleService: TranslateTitleService) {}

  ngOnInit(): void {
    this.translateTitleService.setTitle('Page not found');
  }

}
