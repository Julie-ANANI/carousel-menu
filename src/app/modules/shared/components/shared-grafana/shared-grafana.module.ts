import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedGrafanaComponent } from './shared-grafana.component';

@NgModule({
    declarations: [SharedGrafanaComponent],
    exports: [
        SharedGrafanaComponent
    ],
    imports: [
        CommonModule
    ]
})
export class SharedGrafanaModule { }
