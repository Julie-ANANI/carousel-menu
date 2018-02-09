import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-search',
  templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.scss']
})
export class AdminSearchComponent {

  private _total = 0;

  constructor() { }

  get total(): number {
    return this._total;
  }

}
