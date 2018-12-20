import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputListComponent } from './input-list.component';
import { RouterModule } from '@angular/router';

import { PipeModule } from '../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    PipeModule
  ],
  declarations: [
    InputListComponent
  ],
  exports: [
    InputListComponent
  ]
})

export class InputListModule {}
