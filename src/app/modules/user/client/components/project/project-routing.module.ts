import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectComponent } from './project.component';

import { AuthGuard } from '../../../../../guards/auth-guard.service';

const projectRoutes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'exploration', pathMatch: 'full' },
      { path: 'synthesis', pathMatch: 'full' },
      { path: 'settings', pathMatch: 'full' },
      {
        path: 'setup',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'survey', pathMatch: 'full' },
          { path: 'pitch', pathMatch: 'full' },
          { path: 'objectives', pathMatch: 'full' },
          { path: 'targeting', pathMatch: 'full' },
          { path: '', redirectTo: 'pitch', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'settings', pathMatch: 'full' }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(projectRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ProjectRoutingModule { }
