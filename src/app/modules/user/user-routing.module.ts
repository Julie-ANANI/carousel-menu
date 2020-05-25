import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

import { AuthGuard } from '../../guards/auth-guard.service';
import { InnovationResolver } from '../../resolvers/innovation.resolver';

const userRoutes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    component: UserComponent,
    children: [
      {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule'
      },
      {
        path: 'projects/:projectId/print/executive-report',
        loadChildren: '../.././modules/print/print-executive-report/print-executive-report.module#PrintExecutiveReportModule',
        resolve: { innovation : InnovationResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: '',
        loadChildren: './client/client.module#ClientModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class UserRoutingModule { }
