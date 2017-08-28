import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-infographic-synthesis-string',
  templateUrl: './shared-infographic-synthesis-string.component.html',
  styleUrls: ['./shared-infographic-synthesis-string.component.styl']
})
export class SharedInfographicSynthesisStringComponent implements OnInit {

  @Input() public importantValue: string;
  @Input() public secondValue: string;

  constructor() { }

  ngOnInit() {
  }

}
