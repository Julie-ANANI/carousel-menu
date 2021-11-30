import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';

import { AuthGuard } from '../../../guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      {
        path: 'account',
        loadChildren: () => import('./components/account/account.module').then(m => m.AccountModule)
      },
      {
        path: 'synthesis',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('./components/synthesis-list/synthesis-list.module').then(m => m.SynthesisListModule)
          },
          {
            path: ':projectId/:shareKey',
            loadChildren: () => import('../../../modules/public/share/share.module').then(m => m.ShareModule)
          }
        ]
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadChildren: () => import('./components/projects-list/projects-list.module').then(m => m.ProjectsListModule)
          },
          {
            path: 'new',
            canActivate: [AuthGuard],
            loadChildren: () => import('./components/new-project/new-project.module').then(m => m.NewProjectModule)
          },
          {
            path:  ':projectId',
            loadChildren: () => import('./components/project/project.module').then(m => m.ProjectModule)
          }
        ]
      },
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

export class ClientRoutingModule {}
