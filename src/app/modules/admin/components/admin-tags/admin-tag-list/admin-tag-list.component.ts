import { Component, OnInit } from '@angular/core';

import { Tag } from './../../../../../models/tag';

import { TagsService } from './../../../../../services/tags/tags.service';

@Component({
  selector: 'app-admin-tag-list',
  templateUrl: 'admin-tag-list.component.html',
  styleUrls: ['admin-tag-list.component.scss']
})
export class AdminTagListComponent implements OnInit{

  private _config = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      label: -1
    }
  };

  public editUser: {[propString: string]: boolean} = {};

  private _tagList: Array<Tag> = [];

  constructor(private _tagsService: TagsService) {}


  ngOnInit(): void {
    const config= {};
    this._tagsService.getAll(config).subscribe(result=>{
      if(result) {
        this.tagList = result.result;
      }
      console.log(result);
    });
  }

  public createTag() {}


  get tagList(): Array<Tag> { return this._tagList; }

  set tagList( list: Array<Tag> ) { this._tagList = list }

  get total(): number {return 0;}
  get nbSelected(): number {return 0;}
  get config(): any { return this._config; }
}
