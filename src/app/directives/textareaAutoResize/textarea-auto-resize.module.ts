import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TextareaAutoResizeDirective} from './textarea-auto-resize.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TextareaAutoResizeDirective
  ],
  exports: [
    TextareaAutoResizeDirective
  ]
})

export class TextareaAutoResizeModule {}
