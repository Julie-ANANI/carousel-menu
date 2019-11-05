import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteInputComponent } from './auto-complete-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NguiAutoCompleteModule } from '../auto-complete/auto-complete.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NguiAutoCompleteModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    AutoCompleteInputComponent
  ],
  exports: [
    AutoCompleteInputComponent
  ]
})

export class AutoCompleteInputModule {}
