import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InnovationResolver } from '../../../../../resolvers/innovation.resolver';

import { ProjectComponent } from './project.component';

const projectRoutes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    resolve: { innovation : InnovationResolver },
    runGuardsAndResolvers: 'always',
    children: [
      { path: 'exploration', pathMatch: 'full' },
      { path: 'synthesis', pathMatch: 'full' },
      {
        path: 'setup',
        children: [
          { path: 'survey', pathMatch: 'full' },
          { path: 'pitch', pathMatch: 'full' },
          { path: 'targeting', pathMatch: 'full' },
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
