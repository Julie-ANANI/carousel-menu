import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-search',
  templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.scss']
})
export class AdminSearchComponent implements OnInit {

  private _total = 0;

  constructor() { }

  ngOnInit() {
  }

  get total(): number {
    return this._total;
  }

}
