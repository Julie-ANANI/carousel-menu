import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuKebabComponent } from './menu-kebab.component';

@NgModule({
  declarations: [MenuKebabComponent],
  exports:[MenuKebabComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MenuKebabModule { }
