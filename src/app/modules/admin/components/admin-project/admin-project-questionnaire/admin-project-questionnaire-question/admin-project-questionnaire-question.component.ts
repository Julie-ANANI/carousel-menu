import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
 // import {Question} from '../../../../../../models/question';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-admin-project-questionnaire-question',
  templateUrl: './admin-project-questionnaire-question.component.html',
  styleUrls: ['./admin-project-questionnaire-question.component.scss']
})
export class AdminProjectQuestionnaireQuestionComponent implements OnInit {

  @Input() question: any;
  @Input() public stateIN: any;
  @Input() public index: number;
  @Output() questionChange = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();
  @Output() stateOUT= new EventEmitter<any>();
  @Output() clone = new EventEmitter<any>();
  @Output() move = new EventEmitter<any>();

  public isCollapsed = true;
  public formData: FormGroup;
  public formQuestion: FormGroup;
  private _language = 'en';
  public modalAddOption = false;

  constructor( private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    console.log("trop de generation")
    this.formData = this._formBuilder.group({
      controlType: [this.question.controlType]
    });
    this.formQuestion = this._formBuilder.group( {
      labelFR: ['', [Validators.required]],
      labelEN: ['', [Validators.required]],
      color: ['', [Validators.required]],
      positive: []
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

  public addOption() {
    let id = 0;
    if (this.question && this.question.options && this.question.options.length) {
      id = this.question.options.length;
    }
    const opt = {
      identifier: id.toString(),
      label: {
        en: this.formQuestion.value.labelEN,
        fr: this.formQuestion.value.labelFR
      },
      color: this.formQuestion.value.color,
      positive: this.formQuestion.value.positive
    };
    this.question.options.push(opt);
    this._emit();
    }
  public deleteOption(index: any) {
    this.question.options.splice(index, 1);
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

    /*
    if (this.question.controlType == 'radio' || this.question.controlType == 'checkbox') {
      this.question.options.forEach( opt => {
        if (opt.label[lang] == '') {
          missing ++;
        }
      })
    }
    */
    return missing;
  }

  public removeQuestion() {
    this.remove.emit();
  }

  public positiveChange(opt: any) {
    opt.positive = !opt.positive;
    this._emit();
  }

  public languageEN() {
    this._language = 'en';
  }
  public languageFR() {
    this._language = 'fr'
  }

  public update() {
    this._emit();
  }

  private _emitState() {
    this.stateOUT.emit(this.stateIN);
  }

  public coolapseQuestion() {
    this.isCollapsed = !this.isCollapsed;
    this.stateIN[this.index] = !this.stateIN[this.index];
    this._emitState();
  }

  public cloneQuestion() {
    this.clone.emit(this.question);
  }

  public up() {
    this.move.emit('up');
  }
  public down() {
    this.move.emit('down');
  }

}
