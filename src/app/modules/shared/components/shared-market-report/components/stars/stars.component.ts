/**
 * Created by bastien on 24/11/2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: 'stars.component.html',
  styleUrls: ['stars.component.scss']
})

export class StarsComponent implements OnInit {

  private _percentage: any;
  @Input() public note: number;
  @Input() public count: number;

  constructor() { }

  ngOnInit() {
    this._percentage = ((this.note || 0) * 20) + '%';
  }

  set percentage(value: any) {
    this._percentage = value;
  }

  get percentage(): any {
    return this._percentage;
  }
}
