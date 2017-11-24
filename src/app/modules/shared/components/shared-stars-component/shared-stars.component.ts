/**
 * Created by bastien on 24/11/2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'stars',
  templateUrl: 'shared-stars.component.html',
  styleUrls: ['shared-stars.component.scss']
})

export class SharedStarsComponent implements OnInit {

  private _percentage: any;
  @Input() public note: number;

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
