import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CompozerComponent } from '../../classes/compozer-component';
import { TranslateService } from '../../../../i18n/i18n';

@Component({
  selector: 'app-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.styl']
})
export class DynamicFormQuestionComponent implements OnInit {

  @Input() public compozerComponent: CompozerComponent<any>;
  @Input() public form: FormGroup;
  public type: string;

  constructor(private _translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.type = this.compozerComponent.questionType;
  }

  public isFieldInvalid (fieldName: string): boolean {
    return !this.form.controls[this.compozerComponent.key].valid
      && !!this.form.get(fieldName).errors
      && (this.form.get(fieldName).value || this.form.get(fieldName).touched);
  }
}
