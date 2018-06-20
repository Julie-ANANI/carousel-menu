import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

// Interface
import { TemplateForm } from '../interfaces/template-form';

@Injectable()
export class InnovationPreviewSidebarService {

  templateValuesObservable = new Subject<TemplateForm>();

  constructor() { }

  // Receiving the template default values from the parent component.
  setTemplateValues(animationState: string, title: string) {
    const templateValue: TemplateForm = {};

    templateValue.animate = animationState;
    templateValue.title = title;

    this.templateValuesObservable.next(templateValue);
  }

  getTemplateValues(): Subject<TemplateForm> {
    return this.templateValuesObservable;
  }

}
