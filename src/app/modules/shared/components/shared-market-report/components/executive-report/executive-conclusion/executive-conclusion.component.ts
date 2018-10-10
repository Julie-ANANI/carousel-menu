import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-executive-conclusion',
  templateUrl: './executive-conclusion.component.html',
  styleUrls: ['./executive-conclusion.component.scss']
})
export class ExecutiveConclusionComponent implements OnInit {

  @Input() set conclusion(value: string) {
    this.conslusionReceived = value;
  }

  conslusionReceived: string;

  constructor() { }

  ngOnInit() {
  }

}
