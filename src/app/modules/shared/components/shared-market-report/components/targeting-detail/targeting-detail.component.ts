import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';

@Component({
  selector: 'app-targeting-detail',
  templateUrl: './targeting-detail.component.html',
  styleUrls: ['./targeting-detail.component.scss']
})

export class TargetingDetailComponent {

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
