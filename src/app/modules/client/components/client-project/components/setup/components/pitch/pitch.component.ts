import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Innovation } from '../../../../../../../../models/innovation';

@Component({
  selector: 'app-project-pitch',
  templateUrl: 'pitch.component.html',
  styleUrls: ['pitch.component.scss']
})

export class PitchComponent {

  @Input() project: Innovation;
  @Output() updateInnovation = new EventEmitter<Innovation>();

  constructor() {}


  public updateProject(value: Innovation): void {
    const innovation = Object.assign(this.project, value);
    this.updateInnovation.emit(innovation);
  }

}
