import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-tag-new-modal',
  templateUrl: 'admin-tag-new-modal.component.html',
  styleUrls: ['admin-tag-new-modal.component.scss']
})
export class AdminTagNewModalComponent {

  @Input() public title: string;

  private _active = false;
  private _initialData: Array<any> = [];

  constructor() {}

  get active(): boolean { return this._active; }

  get initialData(): Array<any> { return this._initialData; }

  @Input()
  set initialData(data: Array<any>) {
    this._initialData = data;
  }

  @Input()
  set active(data: boolean) {
    this._active = data;
  }

}
