import { Directive } from '@angular/core';

@Directive({
  selector: '[kebabCarouselItem]'
})
export class MenuKebabDirective {

  constructor( public tpl : TemplateRef<any> ) {
  }
}
