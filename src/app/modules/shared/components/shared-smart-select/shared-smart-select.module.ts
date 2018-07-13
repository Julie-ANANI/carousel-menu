// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {SharedSmartSelectInputComponent} from './shared-smart-select.component';

// Components

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    FormsModule

  ],
  declarations: [
    SharedSmartSelectInputComponent
  ],
  exports: [
    SharedSmartSelectInputComponent
  ]
})

export class SharedSmartSelectModule { }
