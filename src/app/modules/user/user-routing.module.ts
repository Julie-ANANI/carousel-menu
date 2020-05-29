import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

import { AuthGuard } from '../../guards/auth-guard.service';
import { InnovationResolver } from '../../resolvers/innovation.resolver';
import { AdminAuthGuard } from '../../guards/admin-auth-guard.service';

const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'admin',
        canActivate: [AdminAuthGuard],
        loadChildren: './admin/admin.module#AdminModule'
      },
      {
        path: 'projects/:projectId/print/executive-report',
        canActivate: [AuthGuard],
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
