import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-infographic-synthesis-worldmap',
  templateUrl: './shared-infographic-synthesis-worldmap.component.html',
  styleUrls: ['./shared-infographic-synthesis-worldmap.component.styl']
})
export class SharedInfographicSynthesisWorldmapComponent implements OnInit {

  @Input() public importantValue: string;
  @Input() public secondValue: string;

  constructor() { }

  ngOnInit() {
  }

}
