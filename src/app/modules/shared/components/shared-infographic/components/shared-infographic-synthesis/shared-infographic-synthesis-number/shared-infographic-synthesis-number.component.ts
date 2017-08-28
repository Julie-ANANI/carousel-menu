import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-infographic-synthesis-number',
  templateUrl: './shared-infographic-synthesis-number.component.html',
  styleUrls: ['./shared-infographic-synthesis-number.component.styl']
})
export class SharedInfographicSynthesisNumberComponent implements OnInit {

  @Input() public importantValue: string;
  @Input() public secondValue: string;

  constructor() { }

  ngOnInit() {
  }

}
