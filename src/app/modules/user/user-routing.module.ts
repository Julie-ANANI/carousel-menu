import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

import { InnovationResolver } from '../../resolvers/innovation.resolver';

const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', loadChildren: './client/client.module#ClientModule' },
      { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
      {
        path: 'projects/:projectId/print/executive-report',
        loadChildren: '../.././modules/print/print-executive-report/print-executive-report.module#PrintExecutiveReportModule',
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
