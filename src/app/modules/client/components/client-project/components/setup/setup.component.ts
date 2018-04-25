import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';

@Component({
  selector: 'app-client-setup-project',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})
export class SetupProjectComponent {

  @Input() project: Innovation;

  constructor() {
  }


}
