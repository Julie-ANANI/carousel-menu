import { Component, OnInit } from '@angular/core';

import { Tag } from '../../../../models/tag';

@Component({
  selector: 'app-admin-tags',
  templateUrl: 'admin-tags.component.html',
  styleUrls: ['admin-tags.component.scss']
})
export class AdminTagsComponent implements OnInit {

  private _creationResult: Tag;

  constructor() { }


  ngOnInit(): void {
    console.log(this._creationResult);
  }
}
