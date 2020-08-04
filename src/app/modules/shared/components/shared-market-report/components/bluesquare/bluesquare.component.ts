import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bluesquare',
  templateUrl: 'bluesquare.component.html',
  styleUrls: ['bluesquare.component.scss']
})

export class BluesquareComponent {

  @Input() numberFocus: number = null

  @Input() subtitle = '';

  @Input() percentage: number = null;

  constructor() {}

}
