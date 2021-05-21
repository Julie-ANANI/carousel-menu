import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from './text-input.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [
    TextInputComponent,
  ],
  exports: [
    TextInputComponent
  ]
})

export class TextInputModule {}
