import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminProfessionalsComponent } from './admin-professionals.component';

import { TranslateModule } from '@ngx-translate/core';
import { SharedProsListModule } from '../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { ErrorTemplate1Module } from '../../../../utility-components/errors/error-template-1/error-template-1.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    PipeModule,
    ErrorTemplate1Module
  ],
  declarations: [
    AdminProfessionalsComponent
  ],
  exports: [
    AdminProfessionalsComponent
  ]
})

export class AdminProfessionalsModule { }
