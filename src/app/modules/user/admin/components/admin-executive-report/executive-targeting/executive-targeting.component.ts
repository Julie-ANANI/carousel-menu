import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveTargeting } from '../../../../../../models/executive-report';
import { CommonService } from '../../../../../../services/common/common.service';
import { SnippetService } from '../../../../../../services/snippet/snippet.service';

@Component({
  selector: 'executive-targeting',
  templateUrl: './executive-targeting.component.html',
  styleUrls: ['./executive-targeting.component.scss']
})

export class ExecutiveTargetingComponent {

  @Input() lang = 'en';

  @Input() set config(value: ExecutiveTargeting) {
    this._config = value;
    this.textColor();
  }

  @Output() configChange: EventEmitter<ExecutiveTargeting> = new EventEmitter<ExecutiveTargeting>();

  private _config: ExecutiveTargeting = <ExecutiveTargeting>{};

  private _targetingColor = '';

  constructor() { }

  public emitChanges() {
    this.configChange.emit(this._config);
  }

  public textColor() {
    this._targetingColor = CommonService.getLimitColor(this._config.abstract.length, 148);
  }

  public onClickSnippet(event: Event) {
    event.preventDefault();
    this._config.abstract = SnippetService.storyboard('TARGETING', this.lang);
    this.textColor();
    this.emitChanges();
  }

  get config(): ExecutiveTargeting {
    return this._config;
  }

  get targetingColor(): string {
    return this._targetingColor;
  }

}
