import { NgModule } from '@angular/core';
import { SharedImportAnswersComponent } from "./shared-import-answers.component";
import { CommonModule } from "@angular/common";
import {SharedCsvErrorModule} from "../shared-csv-error/shared-csv-error.module";
import {TranslateModule} from "@ngx-translate/core";
import {ModalModule} from "@umius/umi-common-component";


@NgModule({
  imports: [CommonModule, SharedCsvErrorModule, TranslateModule, ModalModule],
  declarations: [
    SharedImportAnswersComponent
  ],
  exports: [
    SharedImportAnswersComponent
  ]
})

export class SharedImportAnswersModule {}
