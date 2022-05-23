import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuKebabComponent } from './menu-kebab.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [MenuKebabComponent],
  exports: [MenuKebabComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class MenuKebabModule { }
