import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminProjectsComponent } from './admin-projects.component';

import { ErrorTemplate1Module } from '../../../../utility-components/errors/error-template-1/error-template-1.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { TableModule } from '../../../../table/table.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    RouterModule,
    TranslateModule.forChild(),
    PipeModule,
    RouterModule,
    ErrorTemplate1Module
  ],
  declarations: [
    AdminProjectsComponent
  ],
  exports: [
    AdminProjectsComponent
  ]
})

export class AdminProjectsModule { }
