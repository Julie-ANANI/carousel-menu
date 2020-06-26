import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectComponent } from './project.component';
import { PitchComponent } from './components/setup/components/pitch/pitch.component';
import { SharedProjectSettingsComponent } from '../../../../shared/components/shared-project-settings-component/shared-project-settings.component';

import { AuthGuard } from '../../../../../guards/auth-guard.service';
import {CanDeactivateGuard} from '../../../../../guards/can-deactivate-guard.service';

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
          { path: 'pitch', component: PitchComponent, pathMatch: 'full', canDeactivate: [CanDeactivateGuard] },
          { path: 'targeting', component: SharedProjectSettingsComponent, pathMatch: 'full' },
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
