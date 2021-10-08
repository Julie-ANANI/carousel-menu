import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectComponent } from './project.component';
import { PitchComponent } from './components/setup/components/pitch/pitch.component';
import { TargetingComponent } from './components/setup/components/targeting/targeting.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { SetupComponent } from './components/setup/setup.component';
import { ExplorationComponent } from './components/exploration/exploration.component';
import { SynthesisComponent } from './components/synthesis/synthesis.component';

import { AuthGuard } from '../../../../../guards/auth-guard.service';
import {PendingChangesGuard} from '../../../../../guards/pending-changes-guard.service';
import {ContactComponent} from './components/contact/contact.component';

const projectRoutes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'settings', pathMatch: 'full' },
      { path: 'settings', component: SettingsComponent, pathMatch: 'full' },
      { path: 'exploration', component: ExplorationComponent, pathMatch: 'full' },
      { path: 'contact', component: ContactComponent, pathMatch: 'full' },
      { path: 'synthesis', component: SynthesisComponent, pathMatch: 'full' },
      { path: 'documents', component: DocumentsComponent, pathMatch: 'full' },
      {
        path: 'setup',
        canActivateChild: [AuthGuard],
        component: SetupComponent,
        children: [
          { path: '', redirectTo: 'pitch', pathMatch: 'full' },
          { path: 'pitch', component: PitchComponent, pathMatch: 'full' },
          {
            path: 'targeting',
            component: TargetingComponent,
            pathMatch: 'full',
            canDeactivate: [PendingChangesGuard]
          },
        ]
      }
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
