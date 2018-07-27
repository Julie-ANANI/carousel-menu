// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

// Components
import { SharedFilterMultiComponent } from '../shared-filter-multi/shared-filter-multi.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedFilterMultiComponent
  ],
  exports: [
    SharedFilterMultiComponent
  ]
})

export class SharedFilterMultiModule { }
