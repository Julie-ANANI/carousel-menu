import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveTargeting } from '../../../../../../models/executive-report';
import { CommonService } from '../../../../../../services/common/common.service';

@Component({
  selector: 'executive-targeting',
  templateUrl: './executive-targeting.component.html',
  styleUrls: ['./executive-targeting.component.scss']
})

export class ExecutiveTargetingComponent {

  @Input() set config(value: ExecutiveTargeting) {
    this._config = {
      abstract: value.abstract,
      countries: value.countries || []
    };
    this.textColor();
  }

  @Output() configChange: EventEmitter<ExecutiveTargeting> = new EventEmitter<ExecutiveTargeting>();

  private _config: ExecutiveTargeting = <ExecutiveTargeting>{};

  private _targetingColor = '';

  constructor() { }

  public emitChanges(event: Event) {
    event.preventDefault();
    this.configChange.emit(this._config);
  }

  public textColor() {
    this._targetingColor = CommonService.getLimitColor(this._config.abstract.length, 148);
  }

  get config(): ExecutiveTargeting {
    return this._config;
  }

  get targetingColor(): string {
    return this._targetingColor;
  }

}
