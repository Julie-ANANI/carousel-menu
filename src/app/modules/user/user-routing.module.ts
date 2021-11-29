import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

import { InnovationResolver } from '../../resolvers/innovation.resolver';
import {AuthGuard} from '../../guards/auth-guard.service';

const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'projects/:projectId/print/executive-report',
        canActivate: [AuthGuard],
        loadChildren: () => import('../.././modules/print/print-executive-report/print-executive-report.module')
          .then(m => m.PrintExecutiveReportModule),
        resolve: { innovation : InnovationResolver },
        runGuardsAndResolvers: 'always',
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
