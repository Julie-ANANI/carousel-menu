import { Routes } from '@angular/router';
import { AdminEmailQueueComponent } from './admin-emails-queue/admin-emails-queue.component';
import { AdminBatchInformationComponent } from './admin-batch-information/admin-batch-information.component';
import { AdminEmailBlacklistComponent } from '../admin-email-blacklist/admin-email-blacklist.component';

export const emailsRoutes: Routes = [
  { path: '', redirectTo: 'queue', pathMatch: 'full'},
  { path: 'queue', component: AdminEmailQueueComponent, pathMatch: 'full' },
  { path: 'blacklist', component: AdminEmailBlacklistComponent, pathMatch: 'full' },
  { path: 'batch/:batchId', component: AdminBatchInformationComponent, pathMatch: 'full' }
];
