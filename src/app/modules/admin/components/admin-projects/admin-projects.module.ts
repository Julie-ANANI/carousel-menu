import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableModule } from '../../../table/table.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { AdminProjectsComponent } from './admin-projects.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedTableModule,
    RouterModule,
    TranslateModule.forChild(),
    PipeModule,
    RouterModule
  ],
  declarations: [
    AdminProjectsComponent
  ],
  exports: [
    AdminProjectsComponent
  ]
})

export class AdminProjectsModule { }
