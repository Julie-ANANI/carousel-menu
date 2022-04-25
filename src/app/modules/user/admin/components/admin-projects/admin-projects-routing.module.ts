import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminProjectsComponent} from './admin-projects.component';
import {AdminAuthGuard} from '../../../../../guards/admin-auth-guard.service';
import {AdminInnovationResolver} from '../../../../../resolvers/admin/admin-innovation.resolver';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: AdminProjectsComponent, pathMatch: 'full' },
      {
        path: 'project/:projectId',
        loadChildren: () => import('.././admin-project/admin-project.module').then(m => m.AdminProjectModule),
        canActivateChild: [AdminAuthGuard],
        resolve: { innovation : AdminInnovationResolver },
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
