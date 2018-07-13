// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedFilterInputComponent } from './shared-filter-input.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedFilterInputComponent
  ],
  exports: [
    SharedFilterInputComponent
  ]
})

export class SharedFilterInputModule { }
