import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FormGroup } from '@angular/forms';

// Interface
import { TemplateForm } from '../interfaces/template-form';

@Injectable()
export class UserFormSidebarService {

  templateValuesObservable = new Subject<TemplateForm>();
  formDataObservable = new Subject<FormGroup>();

  constructor() {}

  // sending the form value to the parent component.
  setFormValue(formData: FormGroup) {
    this.formDataObservable.next(formData);
  }

  getFormValue(): Subject<FormGroup> {
    return this.formDataObservable;
  }

  // Receiving the template default values from the parent component.
  setTemplateValues(animationState: string, title: string, type: string) {
    const templateValue: TemplateForm = {};

    templateValue.animate = animationState;
    templateValue.type = type;
    templateValue.title = title;

    this.templateValuesObservable.next(templateValue);
  }

  getTemplateValues(): Subject<TemplateForm> {
    return this.templateValuesObservable;
  }

}
