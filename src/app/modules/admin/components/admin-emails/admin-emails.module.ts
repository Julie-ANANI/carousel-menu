import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { AdminEmailsComponent } from './admin-emails.component';
import { AdminEmailQueueComponent } from './admin-emails-queue/admin-emails-queue.component';
import { AdminEmailTemplatesComponent } from './admin-emails-templates/admin-emails-templates.component';
import { AdminBatchInformationComponent } from './admin-batch-information/admin-batch-information.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminEmailsComponent,
    AdminEmailQueueComponent,
    AdminEmailTemplatesComponent,
    AdminBatchInformationComponent
  ],
  exports: [
    AdminEmailsComponent
  ]
})

export class AdminEmailsModule {}
