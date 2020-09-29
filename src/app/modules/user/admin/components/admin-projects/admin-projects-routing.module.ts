import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AdminProjectsComponent} from './admin-projects.component';

import {AdminAuthGuard} from '../../../../../guards/admin-auth-guard.service';
import {InnovationResolver} from '../../../../../resolvers/innovation.resolver';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: AdminProjectsComponent, pathMatch: 'full' },
      {
        path: 'project/:projectId',
        loadChildren: '.././admin-project/admin-project.module#AdminProjectModule',
        canActivateChild: [AdminAuthGuard],
        resolve: { innovation : InnovationResolver },
        runGuardsAndResolvers: 'always'
      }
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

export class AdminProjectsRoutingModule { }
