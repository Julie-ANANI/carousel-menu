import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../guards/auth-guard.service';
import { DocsGuardService } from '../../guards/docs-guard.service';

import { MonitoringComponent } from './monitoring.component';

const docsRoutes: Routes = [
  {
    path: '',
    component: MonitoringComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'application'
      },
      {
        path: 'application',
      },
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(docsRoutes)
  ],
  providers: [
    DocsGuardService
  ],
  exports: [
    RouterModule
  ]
})

export class MonitoringRoutingModule { }
