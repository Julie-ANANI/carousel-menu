import {Component, OnInit} from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';

@Component({
  selector: 'app-admin-community',
  templateUrl: './admin-community.component.html',
  styleUrls: ['./admin-community.component.scss']
})

export class AdminCommunityComponent implements OnInit {

  //private _tabs: Array<string> = ['members', 'lab'];
  //private _tabs: Array<string> = ['members', 'emailanswers'];
  private _tabs: Array<string> = ['projects', 'members'];

  constructor(private _translateTitleService: TranslateTitleService) {

  }

  ngOnInit(): void {
    this._translateTitleService.setTitle('Community | UMI');
    console.log("Community parent initiated...");
  }

  get tabs(): Array<string> {
    return this._tabs;
  }

}
