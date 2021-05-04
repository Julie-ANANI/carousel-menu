import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedColorPickerComponent } from './shared-color-picker.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [SharedColorPickerComponent],
    exports: [
        SharedColorPickerComponent
    ],
  imports: [
    CommonModule,
    ColorPickerModule,
    FormsModule
  ]
})
export class SharedColorPickerModule { }
