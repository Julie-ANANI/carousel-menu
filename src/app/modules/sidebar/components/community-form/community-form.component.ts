import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'community-form',
  templateUrl: './community-form.component.html',
  styleUrls: ['./community-form.component.scss']
})
export class CommunityFormComponent implements OnInit {

  @Input() set context(value: any) {
    this._context = value;
  }

  @Input() set sidebarState(value: string) {
    console.log(value);
    if (value === undefined || value === 'active') {

    }
  }

  @Input() set type(value: string) {
    this._actionType = value;
  }

  @Input() set config(value: any) {
    console.log(value);
    this._config = value;
  }

  private _actionType = '';

  private _config: any;

  private _context: any = null;

  constructor() { }

  ngOnInit() {
  }

  public onValueTyped(event: Event) {
    this._config = {
      fields: 'firstName lastName tags.label country answers.innovation answers.status ambassador.industry',
      limit: '10',
      offset: '0',
      search: '',
      "$text": `{ "$search": "${event}" }`,
      sort: '{"created":-1}'
    };
  }

  get actionType() {
    return this._actionType;
  }

  get config(): any {
    return this._config;
  }

  get context() {
    return this._context;
  }
}
