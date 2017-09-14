import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-shared-infographic-professional-card',
  templateUrl: './shared-infographic-professional-card.component.html',
  styleUrls: ['./shared-infographic-professional-card.component.styl']
})
export class SharedInfographicProfessionalCardComponent implements OnInit {

  @Input() public professional: any;
  constructor() { }

  ngOnInit() {
  }

}
