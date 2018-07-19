import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from '../../../../../../models/question';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-admin-project-questionnaire-question',
  templateUrl: './admin-project-questionnaire-question.component.html',
  styleUrls: ['./admin-project-questionnaire-question.component.scss']
})
export class AdminProjectQuestionnaireQuestionComponent implements OnInit {

  @Input() question: Question;

  @Output() questionChange = new EventEmitter<any>();

  public isCollapsed = true;
  public formData: FormGroup;
  private _language = 'en';

  constructor( private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formData = this._formBuilder.group({
      controlType: [this.question.controlType]
    });
  }

  public updateType(event: any) {
    this.question.controlType = event;
    this._emit();
  }

  public comment() {
    this.question.canComment = !this.question.canComment;
    this._emit();
  }

  public addOption(event: any) {
    this.question.options.push(event);
    this._emit();
  }

  private _emit() {
    this.questionChange.emit(this.question);
  }

  public language() {
    return this._language;
  }

  public changeLanguage() {
    if (this._language === 'en') {
      this._language = 'fr';
    } else {
      this._language = 'en'
    }
  }

  public count(lang: string) {
    let missing = 0;
    if (this.question.label[lang] === '') {
      missing ++;
    }
    if (this.question.title[lang] === '') {
      missing ++;
    }
    if (this.question.subtitle[lang] === '') {
      missing ++;
    }
    return missing;
  }

  public languageEN() {
    this._language = 'en';
  }
  public languageFR() {
    this._language = 'fr'
  }

}
