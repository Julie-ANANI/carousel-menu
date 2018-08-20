import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminMonitoringComponent } from './admin-monitoring.component';
import { AdminEmailQueueComponent } from './admin-emails-queue/admin-emails-queue.component';
import { AdminAnswersGmailComponent } from './admin-answers-gmail/admin-answers-gmail.component';
import { PipeModule } from '../../../../pipe/pipe.module';
import { AdminBatchInformationComponent } from './admin-batch-information/admin-batch-information.component';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { TableModule } from '../../../table/table.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarModule,
    PipeModule,
    TableModule,
    RouterModule
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
