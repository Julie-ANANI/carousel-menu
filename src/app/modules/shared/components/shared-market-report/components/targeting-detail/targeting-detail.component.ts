import {Component, Input, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../models/innovation';

@Component({
  selector: 'app-targeting-detail',
  templateUrl: './targeting-detail.component.html',
  styleUrls: ['./targeting-detail.component.scss']
})
export class TargetingDetailComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this.innovation = value;
  }

  @Input() set continent(value: any) {
    this.continentTarget = value;
  }

  innovation: Innovation;

  continentTarget: any;

  constructor() { }

  ngOnInit() {
  }

}
