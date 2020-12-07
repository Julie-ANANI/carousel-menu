import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedToggleListComponent } from './shared-toggle-list.component';

@NgModule({
    declarations: [SharedToggleListComponent],
    exports: [
        SharedToggleListComponent
    ],
    imports: [
        CommonModule
    ]
})
export class SharedToggleListModule { }
