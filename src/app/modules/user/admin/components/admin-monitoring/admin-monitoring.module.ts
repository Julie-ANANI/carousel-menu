import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AdminMonitoringComponent } from './admin-monitoring.component';
import { AdminEmailQueueComponent } from './admin-emails-queue/admin-emails-queue.component';
import { AdminAnswersGmailComponent } from './admin-answers-gmail/admin-answers-gmail.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { AdminBatchInformationComponent } from './admin-batch-information/admin-batch-information.component';
import { SidebarModule } from '../../../../sidebar/sidebar.module';
import { TableModule } from '../../../../table/table.module';
import { SidebarEmailFormModule } from '../../../../sidebar/components/emails-form/sidebar-email-form.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarModule,
    PipeModule,
    TableModule,
    RouterModule,
    SidebarEmailFormModule
  ],
  declarations: [
    AdminMonitoringComponent,
    AdminEmailQueueComponent,
    AdminAnswersGmailComponent,
    AdminBatchInformationComponent,
  ],
  exports: [
    AdminMonitoringComponent
  ]
})

export class AdminMonitoringModule {}
