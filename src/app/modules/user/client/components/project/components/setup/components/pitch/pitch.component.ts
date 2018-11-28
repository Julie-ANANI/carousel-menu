import {Component, Output, Input, EventEmitter, OnInit} from '@angular/core';
import { Innovation } from '../../../../../../../../../models/innovation';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-project-pitch',
  templateUrl: 'pitch.component.html',
  styleUrls: ['pitch.component.scss']
})

export class PitchComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._project = value;
    this._canEdit = value.status === 'EDITING' || value.status === 'SUBMITTED';
  }
  @Input() changesSaved: boolean;
  @Input() showPitchFieldError: Subject<boolean>;

  @Output() saveChanges = new EventEmitter<boolean>();
  @Output() innovationToPreview = new EventEmitter<number>();

  private _project: Innovation;
  private _showFieldError: Subject<boolean> = new Subject();
  private _canEdit = false;

  constructor() {}

  public saveInnovation(value: boolean) {
    this.saveChanges.emit(value);
  }

  innovationPreview(value: number) {
    this.innovationToPreview.emit(value);
  }

  ngOnInit(): void {
    this.showPitchFieldError.subscribe( (value: any) => {
      this._showFieldError.next(value);
    });
  }

  get project() {
    return this._project;
  }

  get showFieldError() {
    return this._showFieldError;
  }

  get canEdit() {
    return this._canEdit;
  }

}
