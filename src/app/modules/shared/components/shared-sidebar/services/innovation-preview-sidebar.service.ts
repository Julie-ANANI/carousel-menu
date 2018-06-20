import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

// Interface
import { InnovationPreview } from '../interfaces/innovation-preview';

@Injectable()
export class InnovationPreviewSidebarService {

  valuesObservable = new Subject<InnovationPreview>();

  constructor() { }

  /*
      Receiving the template default values and the innovation id
      and the language from the parent component.
   */
  setValues(animationState: string, title: string, id: string, lang: string) {
    const innovation: InnovationPreview = {};

    innovation.title = title;
    innovation.animate = animationState;
    innovation.id = id;
    innovation.lang = lang;

    this.valuesObservable.next(innovation);
  }

  getValues(): Subject<InnovationPreview> {
    return this.valuesObservable;
  }

}
