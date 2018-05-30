import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Innovation } from '../../../../../../../../models/innovation';
import { CommonService } from '../../../../../../../../services/common/common.service';

@Component({
  selector: 'app-project-pitch',
  templateUrl: 'pitch.component.html',
  styleUrls: ['pitch.component.scss']
})

export class PitchComponent {

  @Input() project: Innovation;
  @Input() changesSaved: boolean;

  @Output() updateInnovation = new EventEmitter<Innovation>();
  @Output() saveChanges = new EventEmitter<boolean>();

  constructor(private common: CommonService) {}

  public updateProject(value: Innovation): void {
    const innovation = this.common.deepMerge(this.project, value);
    this.updateInnovation.emit(innovation);
  }

  public saveInnovation(value: boolean) {
    this.saveChanges.emit(value);
  }

  public innovationSaved(value: boolean) {
    this.changesSaved = this.changesSaved;
  }

}
