import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../../../../../../models/innovation';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})

export class ObjectivesComponent {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  private _innovation: Innovation;

  get innovation(): Innovation {
    return this._innovation;
  }

}
