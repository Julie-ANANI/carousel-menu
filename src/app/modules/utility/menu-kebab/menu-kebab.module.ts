import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuKebabComponent } from './menu-kebab.component';
import { MenuKebabDirective } from './menu-kebab.directive';

@NgModule({
  declarations: [MenuKebabComponent, Directive, MenuKebabDirective],
  exports: [MenuKebabComponent, MenuKebabDirective
  ],
  imports: [
    CommonModule
  ]
})
export class MenuKebabModule { }
