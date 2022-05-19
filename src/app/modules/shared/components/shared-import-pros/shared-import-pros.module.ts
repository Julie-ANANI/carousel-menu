// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { SharedImportProsComponent } from './shared-import-pros.component';
import {SharedCsvErrorModule} from '../shared-csv-error/shared-csv-error.module';
import {ModalModule} from '@umius/umi-common-component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedCsvErrorModule,
        ModalModule,
        TranslateModule
    ],
  declarations: [
    SharedImportProsComponent
  ],
  exports: [
    SharedImportProsComponent
  ]
})

export class SharedImportProsModule { }
