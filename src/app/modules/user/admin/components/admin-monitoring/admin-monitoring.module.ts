import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AdminMonitoringRoutingModule } from './admin-monitoring-routing.module';

import { AdminMonitoringComponent } from './admin-monitoring.component';
import { AdminEmailQueueComponent } from './admin-emails-queue/admin-emails-queue.component';
import { AdminAnswersGmailComponent } from './admin-answers-gmail/admin-answers-gmail.component';
import { AdminProfessionalShieldComponent } from './admin-professional-shield/admin-professional-shield.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { AdminBatchInformationComponent } from './admin-batch-information/admin-batch-information.component';
import { SidebarBlacklistModule } from '../../../../sidebars/components/sidebar-blacklist/sidebar-blacklist.module';
import {SidebarFullModule, TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    PipeModule,
    RouterModule,
    SidebarBlacklistModule,
    AdminMonitoringRoutingModule,
    SidebarFullModule,
    TableModule,
  ],
  declarations: [
    AdminMonitoringComponent,
    AdminEmailQueueComponent,
    AdminAnswersGmailComponent,
    AdminBatchInformationComponent,
    AdminProfessionalShieldComponent
  ],
  exports: [
    AdminMonitoringComponent
  ]
})

export class AdminMonitoringModule {}
