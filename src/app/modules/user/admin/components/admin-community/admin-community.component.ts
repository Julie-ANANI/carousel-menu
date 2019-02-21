import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';

@Component({
  selector: 'app-admin-community',
  templateUrl: './admin-community.component.html',
  styleUrls: ['./admin-community.component.scss']
})

export class AdminCommunityComponent implements OnInit {

  //private _tabs: Array<string> = ['members', 'lab'];
  //private _tabs: Array<string> = ['members', 'emailanswers'];
  private _tabs: Array<string> = ['members'];

  constructor(private translateTitleService: TranslateTitleService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('UMI Community');
  }

  get tabs(): Array<string> {
    return this._tabs;
  }

}
