import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AdminProjectStoryboardComponent } from './admin-project-storyboard.component';

import { ModalModule } from '../../../../utility-components/modals/modal/modal.module';
import { AdminExecutiveReportModule } from '../admin-executive-report/admin-executive-report.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ModalModule,
    RouterModule,
    AdminExecutiveReportModule
  ],
  declarations: [
    AdminProjectStoryboardComponent
  ],
  exports: [
    AdminProjectStoryboardComponent
  ]
})

export class AdminProjectStoryboardModule { }
