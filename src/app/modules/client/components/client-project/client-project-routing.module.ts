import { ClientProjectComponent } from './client-project.component';
import { ExplorationProjectComponent } from './components/exploration/exploration.component';
import { HistoryProjectComponent } from './components/history/history.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { SetupProjectComponent } from './components/setup/setup.component';
import { ProjectEditExample1Component } from './components/project-edit-example1/project-edit-example1.component';
import { ProjectEditExample2Component } from './components/project-edit-example2/project-edit-example2.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { SharedMarketReportComponent } from '../../../shared/components/shared-market-report/shared-market-report.component';
import { InnovationResolver } from '../../../../resolvers/innovation.resolver';
import { AuthGuard } from '../../../../auth-guard.service';

export const clientProjectRoutes: any = [
  {
    path: 'projects',
    children: [
      { path: '', component: ProjectsListComponent, pathMatch: 'full', canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'project',
    children: [
      { path: 'new', component: NewProjectComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      {
        path: ':projectId',
        resolve: { innovation : InnovationResolver },
        runGuardsAndResolvers: 'always',
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
            path: 'synthesis', component: SharedMarketReportComponent, canActivate: [AuthGuard], pathMatch: 'full'
          },
          {
            path: 'history', component: HistoryProjectComponent, canActivate: [AuthGuard], pathMatch: 'full'
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
    ]
  }
];
