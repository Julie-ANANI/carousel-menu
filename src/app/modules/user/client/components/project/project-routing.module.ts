import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InnovationResolver } from '../../../../../resolvers/innovation.resolver';

import { ProjectComponent } from './project.component';
import { SetupComponent } from './components/setup/setup.component';
import { ExplorationComponent } from './components/exploration/exploration.component';
import { TargetingComponent } from './components/setup/components/targeting/targeting.component';
import { SurveyComponent } from './components/setup/components/survey/survey.component';
import { PitchComponent } from './components/setup/components/pitch/pitch.component';
import { SharedMarketReportComponent } from '../../../../shared/components/shared-market-report/shared-market-report.component';


const projectRoutes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    resolve: { innovation : InnovationResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'exploration',
        component: ExplorationComponent,
        pathMatch: 'full'
      },
      {
        path: 'synthesis',
        component: SharedMarketReportComponent,
        pathMatch: 'full'
      },
      {
        path: 'setup',
        component: SetupComponent,
        children: [
          { path: 'survey', component: SurveyComponent, pathMatch: 'full' },
          { path: 'pitch', component: PitchComponent, pathMatch: 'full' },
          { path: 'targeting', component: TargetingComponent, pathMatch: 'full' },
          { path: '', redirectTo: 'targeting', pathMatch: 'full' }
        ]
      },
      {
        path: '',
        redirectTo: 'setup',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(projectRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})

export class ProjectRoutingModule { }
