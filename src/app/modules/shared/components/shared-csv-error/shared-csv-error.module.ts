import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCsvErrorComponent } from './shared-csv-error.component';

@NgModule({
    declarations: [SharedCsvErrorComponent],
    exports: [
        SharedCsvErrorComponent
    ],
    imports: [
        CommonModule
    ]
})
export class SharedCsvErrorModule { }
