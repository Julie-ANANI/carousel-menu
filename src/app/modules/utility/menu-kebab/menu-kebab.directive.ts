import {Directive, TemplateRef} from '@angular/core';

@Directive({
  selector: '[kebabCarouselItem]'
})
export class MenuKebabDirective {

  constructor( public templateItem : TemplateRef<any> ) {
  }
}
