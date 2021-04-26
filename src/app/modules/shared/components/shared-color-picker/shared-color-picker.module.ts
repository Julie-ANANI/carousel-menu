import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedColorPickerComponent } from './shared-color-picker.component';

@NgModule({
    declarations: [SharedColorPickerComponent],
    exports: [
        SharedColorPickerComponent
    ],
    imports: [
        CommonModule
    ]
})
export class SharedColorPickerModule { }
