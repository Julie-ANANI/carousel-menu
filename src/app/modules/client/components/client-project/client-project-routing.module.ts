import { Routes } from '@angular/router';

import { ClientProjectComponent } from './client-project.component';
import { ExplorationProjectComponent } from './components/exploration/exploration.component';
import { SetupProjectComponent } from './components/setup/setup.component';
import { ProjectEditExample1Component } from './components/project-edit-example1/project-edit-example1.component';
import { ProjectEditExample2Component } from './components/project-edit-example2/project-edit-example2.component';
import { InnovationResolver } from '../../../../resolvers/innovation.resolver';
import { AuthGuard } from '../../../../auth-guard.service';

export const clientProjectRoutes: Routes = [
  {
    path: ':projectId',
    resolve: { innovation : InnovationResolver },
    component: ClientProjectComponent,
    children: [
      {
        path: 'setup', component: SetupProjectComponent, canActivate: [AuthGuard], pathMatch: 'full'
        // canDeactivate: [PendingChangesGuard] TODO: uncomment
      },
      {
        path: 'exploration', component: ExplorationProjectComponent, canActivate: [AuthGuard], pathMatch: 'full'
      },
      {
        path: 'synthesis', component: SetupProjectComponent, canActivate: [AuthGuard], pathMatch: 'full'
      }
    ]
  },
  {
    path: 'example',
    children: [
      { path: '1', component: ProjectEditExample1Component },
      { path: '2', component: ProjectEditExample2Component }
    ]
  }
];
