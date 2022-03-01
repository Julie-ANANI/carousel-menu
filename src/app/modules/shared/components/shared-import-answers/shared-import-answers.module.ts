import { NgModule } from '@angular/core';
import { SharedImportAnswersComponent } from "./shared-import-answers.component";
import { CommonModule } from "@angular/common";


@NgModule({
  imports: [CommonModule],
  declarations: [
    SharedImportAnswersComponent
  ],
  exports: [
    SharedImportAnswersComponent
  ]
})

export class SharedImportAnswersModule {}
