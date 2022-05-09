import { Directive } from '@angular/core';

@Directive({
  selector: '[carouselItem]'
})
export class MenuKebabDirective {

  constructor( public tpl : TemplateRef<any> ) {
  }
}
