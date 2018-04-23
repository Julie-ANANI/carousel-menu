/**
 * Created by bastien on 16/11/2017.
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'market-report-bluesquare',
  templateUrl: 'bluesquare.component.html',
  styleUrls: ['bluesquare.component.scss']
})

export class BluesquareComponent {

  @Input() public numberFocus: number;
  @Input() public subtitle: string;
  @Input() public percentage: number;

  constructor() { }

}
