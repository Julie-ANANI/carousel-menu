import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
    if (value === undefined || value === 'active') {

    }
  }

  @Input() set innovationId(value: string) {
    this._innovationId = value;
  }

  @Input() set type(value: string) {
    this._actionType = value;
  }

  @Input() set config(value: any) {
    this._config = value;
  }

  @Output('callbackNotification') _callbackNotification = new EventEmitter<any>();

  private _actionType: string;

  private _config: any;

  private _context: any = null;

  private _parentCb: any = null;

  private _innovationId: string;

  constructor() { }

  ngOnInit() {
    console.log(this._parentCb && typeof this._parentCb === 'function');
  }


  public onValueTyped(event: any) {
    this._config = {
      fields: 'firstName lastName tags.label country answers.innovation answers.status ambassador.industry campaigns._id campaigns.innovation campaigns.type innovations._id',
      limit: '10',
      offset: '0',
      search: '',
      "$text": `{ "$search": "${event}" }`,
      sort: '{"created":-1}'
    };
  }


  public callbackNotification(event: Event) {
    this._callbackNotification.emit(event);
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

  get innovationId(): string {
    return this._innovationId;
  }

}
