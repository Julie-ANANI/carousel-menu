import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminEmailsComponent } from './admin-emails.component';
import { AdminEmailQueueComponent } from './admin-emails-queue/admin-emails-queue.component';
import { PipeModule } from '../../../../pipe/pipe.module';
import { AdminBatchInformationComponent } from './admin-batch-information/admin-batch-information.component';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { SharedTableModule } from '../../../table/table.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarModule,
    PipeModule,
    SharedTableModule,
    RouterModule
  ],
  declarations: [
    AdminEmailsComponent,
    AdminEmailQueueComponent,
    AdminBatchInformationComponent
  ],
  exports: [
    AdminEmailsComponent
  ]
})

export class AdminEmailsModule {}
