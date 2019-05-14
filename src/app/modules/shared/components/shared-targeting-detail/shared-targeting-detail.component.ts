import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../models/innovation';

@Component({
  selector: 'app-shared-targeting-detail',
  templateUrl: './shared-targeting-detail.component.html',
  styleUrls: ['./shared-targeting-detail.component.scss']
})

export class SharedTargetingDetailComponent {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  @Input() set continent(value: any) {
    this._continentTarget = value;
  }

  private _innovation: Innovation;

  private _continentTarget: any;

  constructor() { }

  get innovation(): Innovation {
    return this._innovation;
  }

  get continentTarget(): any {
    return this._continentTarget;
  }

}
