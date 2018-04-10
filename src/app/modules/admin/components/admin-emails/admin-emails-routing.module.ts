import { Routes } from '@angular/router';
import { AdminEmailQueueComponent } from './admin-emails-queue/admin-emails-queue.component';
import { AdminEmailTemplatesComponent } from './admin-emails-templates/admin-emails-templates.component';
import { AdminBatchInformationComponent } from './admin-batch-information/admin-batch-information.component';
import { SharedEmailBlacklistComponent } from './../../../shared/components/shared-email-blacklist/shared-email-blacklist.component';
import { emailsTemplatesRoutes } from './admin-emails-templates/admin-emails-templates-routing.module';

export const emailsRoutes: Routes = [
  { path: '', redirectTo: 'queue', pathMatch: 'full'},
  { path: 'queue', component: AdminEmailQueueComponent, pathMatch: 'full' },
  { path: 'templates', component: AdminEmailTemplatesComponent, children: [
    ...emailsTemplatesRoutes
  ] },
  { path: 'blacklist', component: SharedEmailBlacklistComponent, pathMatch: 'full' },
  { path: 'batch/:batchId', component: AdminBatchInformationComponent, pathMatch: 'full' }
];
