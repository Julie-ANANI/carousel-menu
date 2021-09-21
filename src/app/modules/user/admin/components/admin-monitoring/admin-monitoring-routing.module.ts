import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AdminEmailQueueComponent } from './admin-emails-queue/admin-emails-queue.component';
import { AdminAnswersGmailComponent } from './admin-answers-gmail/admin-answers-gmail.component';
import { AdminBatchInformationComponent } from './admin-batch-information/admin-batch-information.component';
import { AdminProfessionalShieldComponent } from './admin-professional-shield/admin-professional-shield.component';
import { AdminMonitoringComponent } from './admin-monitoring.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminMonitoringComponent,
    children: [
      { path: '', redirectTo: 'queue', pathMatch: 'full'},
      { path: 'queue', component: AdminEmailQueueComponent, pathMatch: 'full' },
      { path: 'gmail', component: AdminAnswersGmailComponent, pathMatch: 'full' },
      { path: 'batch/:batchId', component: AdminBatchInformationComponent, pathMatch: 'full' },
      { path: 'shield', component: AdminProfessionalShieldComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminMonitoringRoutingModule {}
