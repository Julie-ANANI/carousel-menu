import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'community-form',
  templateUrl: './community-form.component.html',
  styleUrls: ['./community-form.component.scss']
})
export class CommunityFormComponent implements OnInit {

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {

    }
  }

  @Input() set type(value: string) {
    this.actionType = value;
    this._loadTemplate();
  }

  actionType = '';

  constructor() { }

  ngOnInit() {
  }

  private _loadTemplate() {

    switch (this.actionType) {

      case '':

        break;

      default:
      // do nothing...

    }

  }


  public onSave() {
    switch (this.actionType) {

      case '':
        break;

      default:
      // do nothing...

    }

  }

}
