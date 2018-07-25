import { Routes } from '@angular/router';
import { AdminEmailQueueComponent } from './admin-emails-queue/admin-emails-queue.component';
import { AdminBatchInformationComponent } from './admin-batch-information/admin-batch-information.component';

export const monitoringRoutes: Routes = [
  { path: '', redirectTo: 'queue', pathMatch: 'full'},
  { path: 'queue', component: AdminEmailQueueComponent, pathMatch: 'full' },
  { path: 'batch/:batchId', component: AdminBatchInformationComponent, pathMatch: 'full' }
];
