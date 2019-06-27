import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminProfessionalsComponent } from './admin-professionals.component';

import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { ErrorTemplate1Module } from '../../../../utility-components/errors/error-template-1/error-template-1.module';
import { SharedProfessionalsListModule } from '../../../../shared/components/shared-professionals-list/shared-professionals-list.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    PipeModule,
    ErrorTemplate1Module,
    SharedProfessionalsListModule
  ],
  declarations: [
    AdminProfessionalsComponent
  ],
  exports: [
    AdminProfessionalsComponent
  ]
})

export class AdminProfessionalsModule { }
