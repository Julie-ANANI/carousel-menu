import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Innovation } from '../../../../../../../../models/innovation';
import { InnovationSettings } from '../../../../../../../../models/innov-settings';

@Component({
  selector: 'app-project-targeting',
  templateUrl: 'targeting.component.html',
  styleUrls: ['targeting.component.scss']
})

export class TargetingComponent {

  @Input() project: Innovation;

  @Output() newSettings = new EventEmitter<InnovationSettings>();

  constructor() {}

  public updateSettings(value: InnovationSettings): void {
    this.newSettings.emit(value);
  }



}
