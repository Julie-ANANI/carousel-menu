import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Innovation} from '../../../../models/innovation';
import {InnovationSettings} from '../../../../models/innov-settings';

@Component({
  selector: 'app-innovation-form',
  templateUrl: './innovation-form.component.html',
  styleUrls: ['./innovation-form.component.scss']
})
export class InnovationFormComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._project = value;
  };

  @Input() set type(type: string) {
    this._type = type;
    this.loadTypes();
  }

  @Input() sidebarState: Subject<string>;

  @Output() projectChange = new EventEmitter<Innovation>();

  isPitch = false;
  isTargeting = false;

  private _type = '';

  private _project: Innovation = null;
  private _isChange = false;

  constructor() { }

  ngOnInit() {

    if (this.sidebarState) {
      this.sidebarState.subscribe((state) => {
        if (state === 'inactive') {
          setTimeout (() => {
            this.isChange = false;
          }, 500);
        }
      })
    }
  }

  reinitialiseForm() {
    this.isPitch = false;
    this.isTargeting = false
  }

  loadTypes() {
    this.reinitialiseForm();

    switch (this.type) {
      case('pitch') : {
        this.isPitch = true;
        break;
      } case('targeting'): {
        this.isTargeting = true;
        break;
      } case('preview'): {
        break;
      } default: {
        break;
      }
    }

  }

  onSubmit() {
    switch (this.type) {
      case('pitch') : {
        this.projectChange.emit(this._project);
        break;
      } case('targeting'): {
        this.projectChange.emit(this._project);
        break;
      } case('preview'): {
        break;
      } default: {
        break;
      }
    }
  }

  projectEdit(value: Innovation) {
    this._project = value;
  }

  settingsEdit(value: InnovationSettings) {
    this._isChange = true;
    this.project.settings = value;
  }

  get type(): string {
    return this._type;
  }

  get project(): Innovation {
    return this._project;
  }

  get isChange(): boolean {
    return this._isChange;
  }

  set isChange(value: boolean) {
    this._isChange = value;
  }
}
