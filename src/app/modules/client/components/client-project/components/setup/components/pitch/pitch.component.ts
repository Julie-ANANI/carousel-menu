import {Component, Output, Input, EventEmitter, OnInit} from '@angular/core';
import { Innovation } from '../../../../../../../../models/innovation';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-project-pitch',
  templateUrl: 'pitch.component.html',
  styleUrls: ['pitch.component.scss']
})

export class PitchComponent implements OnInit {

  @Input() project: Innovation;
  @Input() changesSaved: boolean;
  @Input() showFieldError: Subject<boolean>;

  @Output() updateInnovation = new EventEmitter<Innovation>();
  @Output() saveChanges = new EventEmitter<boolean>();
  @Output() pitchFormFields = new EventEmitter<boolean>();

  constructor() {}

  public updateProject(value: Innovation): void {
    const innovation = Object.assign(this.project, value);
    this.updateInnovation.emit(innovation);
  }

  public saveInnovation(value: boolean) {
    this.saveChanges.emit(value);
  }

  public innovationSaved() {
    this.changesSaved = this.changesSaved;
  }

  public checkFormValidation(value: boolean) {
    this.pitchFormFields.emit(value);
  }

  ngOnInit(): void {
    this.showFieldError.subscribe( value => {
      console.log(value);
    });
  }

}
