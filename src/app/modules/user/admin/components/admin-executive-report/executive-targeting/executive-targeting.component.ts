import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveTargeting } from '../../../../../../models/executive-report';
import { CommonService } from '../../../../../../services/common/common.service';
import { SnippetService } from '../../../../../../services/snippet/snippet.service';
import { ExecutiveReportFrontService } from '../../../../../../services/executive-report/executive-report-front.service';

@Component({
  selector: 'app-admin-executive-targeting',
  templateUrl: './executive-targeting.component.html',
})

export class ExecutiveTargetingComponent {

  @Input() isEditable = false;

  @Input() lang = 'en';

  @Input() set config(value: ExecutiveTargeting) {
    this._config = value;
    this.textColor();
  }

  @Output() configChange: EventEmitter<ExecutiveTargeting> = new EventEmitter<ExecutiveTargeting>();

  private _config: ExecutiveTargeting = <ExecutiveTargeting>{};

  private _targetingColor = '';

  constructor(private _executiveReportFrontService: ExecutiveReportFrontService) { }

  public emitChanges() {
    if (this.isEditable) {
      this.configChange.emit(this._config);
    }
  }

  public textColor() {
    this._targetingColor = CommonService.getLimitColor(this._config.abstract, 148);
  }

  public onClickPlay(event: Event) {
    event.preventDefault();
    this._executiveReportFrontService.audio(this._config.abstract, this.lang);
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
