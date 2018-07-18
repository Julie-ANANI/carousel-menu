///<reference path="../../../../../../../../node_modules/@angular/forms/src/form_builder.d.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
// import {Section} from '../../../../../../models/section';


@Component({
  selector: 'app-admin-project-questionnaire-section',
  templateUrl: './admin-project-questionnaire-section.component.html',
  styleUrls: ['./admin-project-questionnaire-section.component.scss']
})
export class AdminProjectQuestionnaireSectionComponent implements OnInit {

  @Input() set section(sec) {
    this._section = sec;
  }
  @Output() sectionUpdated = new EventEmitter<any>();


  private _section: any;
  public formData: FormGroup;
  public isCollapsed = true;
  constructor( private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formData = this._formBuilder.group({
      description: [this._section.description]
    });
  }


  public updateDescription(event: any) {
    this._section.description = event;
    this.sectionUpdated.emit(this._section);
  }

  public updateQuestion(event: any) {

  }


  get section() {
    return this._section;
  }
}
