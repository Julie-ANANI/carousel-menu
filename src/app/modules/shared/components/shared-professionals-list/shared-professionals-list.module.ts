import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProfessionalsListComponent } from './shared-professionals-list.component';

import { TableModule } from '../../../table/table.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TableModule
  ],
  declarations: [
    SharedProfessionalsListComponent
  ],
  exports: [
    SharedProfessionalsListComponent
  ]
})

export class SharedProfessionalsListModule { }
