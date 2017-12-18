import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';

@Component({
  selector: 'app-shared-not-found',
  templateUrl: './shared-not-found.component.html',
  styleUrls: ['./shared-not-found.component.scss']
})
export class SharedNotFoundComponent implements OnInit {

  constructor(private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    this._titleService.setTitle('404.PAGE_NOT_FOUND');
  }

}
