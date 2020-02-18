import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AdminProjectStoryboardComponent } from './admin-project-storyboard.component';

import { ModalModule } from '../../../../utility-components/modals/modal/modal.module';
import { SharedExecutiveReportModule } from '../../../../shared/components/shared-executive-report/shared-executive-report.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ModalModule,
    SharedExecutiveReportModule,
    RouterModule
  ],
  declarations: [
    AdminProjectStoryboardComponent
  ],
  exports: [
    AdminProjectStoryboardComponent
  ]
})

export class AdminProjectStoryboardModule { }
