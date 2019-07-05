import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-community',
  templateUrl: './admin-community.component.html',
  styleUrls: ['./admin-community.component.scss']
})

export class AdminCommunityComponent implements OnInit {

  //private _tabs: Array<string> = ['members', 'lab'];
  //private _tabs: Array<string> = ['members', 'emailanswers'];
  private _tabs: Array<string> = ['projects', 'members'];

  constructor() { }

  ngOnInit(): void {
    console.log("Community parent initiated...");
  }

  get tabs(): Array<string> {
    return this._tabs;
  }

}
