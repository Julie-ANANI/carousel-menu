import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-searches',
  templateUrl: './admin-searches.component.html',
  styleUrls: ['./admin-searches.component.scss']
})
export class AdminSearchesComponent implements OnInit {

  private _total = 0;

  constructor() { }

  ngOnInit() {
  }

  get total(): number {
    return this._total;
  }

}
