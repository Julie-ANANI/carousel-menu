import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { AccountComponent } from './components/account/account.component';
import { SynthesisListComponent } from './components/synthesis-list/synthesis-list.component';
import { SynthesisCompleteComponent } from '../../public/share/component/synthesis-complete/synthesis-complete.component';
import { ExecutiveReportComponent } from './components/print/executive-report/executive-report.component';

import { AuthGuard } from '../../../guards/auth-guard.service';

const clientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'account', component: AccountComponent, pathMatch: 'full' },
      {
        path: 'synthesis',
        canActivateChild: [AuthGuard],
        children: [
          { path: '', component: SynthesisListComponent, pathMatch: 'full' },
          { path: ':projectId/:shareKey', component: SynthesisCompleteComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'projects/:projectId/print/executive-report',
        canActivate: [AuthGuard],
        component: ExecutiveReportComponent,
        pathMatch: 'full'
      },
      {
        path: 'projects',
        canActivateChild: [AuthGuard],
        children: [
          { path: '', component: ProjectsListComponent, pathMatch: 'full' },
          { path: 'new', component: NewProjectComponent, pathMatch: 'full' },
          { path:  ':projectId', loadChildren: './components/project/project.module#ProjectModule' }
        ]
      },
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(clientRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ClientRoutingModule {}
