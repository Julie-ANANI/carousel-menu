import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedImportAnswersComponent } from './shared-import-answers.component';

@NgModule({
  declarations: [SharedImportAnswersComponent],
  exports: [
    SharedImportAnswersComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedImportAnswersModule { }
