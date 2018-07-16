import { Routes } from '@angular/router';
import { AdminEmailQueueComponent } from './admin-emails-queue/admin-emails-queue.component';
import { AdminEmailTemplatesComponent } from './admin-emails-templates/admin-emails-templates.component';
import { AdminBatchInformationComponent } from './admin-batch-information/admin-batch-information.component';
import { AdminEmailBlacklistComponent } from '../admin-email-blacklist/admin-email-blacklist.component';
import { emailsTemplatesRoutes } from './admin-emails-templates/admin-emails-templates-routing.module';

export const emailsRoutes: Routes = [
  { path: '', redirectTo: 'queue', pathMatch: 'full'},
  { path: 'queue', component: AdminEmailQueueComponent, pathMatch: 'full' },
  { path: 'templates', component: AdminEmailTemplatesComponent, children: [
    ...emailsTemplatesRoutes
  ] },
  { path: 'blacklist', component: AdminEmailBlacklistComponent, pathMatch: 'full' },
  { path: 'batch/:batchId', component: AdminBatchInformationComponent, pathMatch: 'full' }
];
