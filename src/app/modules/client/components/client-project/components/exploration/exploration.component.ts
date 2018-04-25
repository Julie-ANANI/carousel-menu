import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';

@Component({
  selector: 'app-client-exploration-project',
  templateUrl: 'exploration.component.html',
  styleUrls: ['exploration.component.scss']
})
export class ExplorationProjectComponent {

  @Input() project: Innovation;

  constructor() {
  }


}
