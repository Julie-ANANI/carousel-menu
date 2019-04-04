import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'community-form',
  templateUrl: './community-form.component.html',
  styleUrls: ['./community-form.component.scss']
})
export class CommunityFormComponent implements OnInit {

  @Input() set sidebarState(value: string) {
    console.log(value);
    if (value === undefined || value === 'active') {

    }
  }

  @Input() set type(value: string) {
    this._actionType = value;
    this._loadTemplate();
  }

  @Input() set config(value: any) {
    console.log(value);
    this._config = value;
  }

  private _actionType = '';

  private _config: any;

  constructor() { }

  ngOnInit() {
  }

  private _loadTemplate() {

    console.log(this._actionType);

    switch (this._actionType) {

      case '':

        break;

      default:
      // do nothing...

    }

  }


  public onSave() {
    switch (this._actionType) {

      case '':
        break;

      default:
      // do nothing...

    }

  }

  public onValueTyped(event: Event) {
    console.log(event);
  }

  get actionType() {
    return this._actionType;
  }

  get config(): any {
    return this._config;
  }

}
