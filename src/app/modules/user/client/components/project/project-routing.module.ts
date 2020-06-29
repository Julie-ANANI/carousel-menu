import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectComponent } from './project.component';
import { PitchComponent } from './components/setup/components/pitch/pitch.component';
import { TargetingComponent } from './components/setup/components/targeting/targeting.component';

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
      { path: 'documents', pathMatch: 'full' },
      {
        path: 'setup',
        canActivateChild: [AuthGuard],
        children: [
          { path: '', redirectTo: 'pitch', pathMatch: 'full' },
          { path: 'pitch', component: PitchComponent, pathMatch: 'full' },
          { path: 'targeting', component: TargetingComponent, pathMatch: 'full' },
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
