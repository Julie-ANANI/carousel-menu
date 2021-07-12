import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AdminLibrariesWorkflowsComponent } from './admin-libraries-workflows/admin-libraries-workflows.component';
import { AdminSignaturesLibraryComponent } from './admin-signatures-library/admin-signatures-library.component';
import { AdminEmailsLibraryComponent } from './admin-emails-library/admin-emails-library.component';
import { AdminPresetsListComponent } from './admin-presets/admin-presets-list/admin-presets-list.component';
import { AdminPresetsEditComponent } from './admin-presets/admin-presets-edit/admin-presets-edit.component';
import { AdminLibrariesComponent } from './admin-libraries.component';

import { PresetResolver } from '../../../../../resolvers/preset.resolver';
import { SignaturesResolver } from '../../../../../resolvers/admin/signatures-resolver';
import { PresetsResolver } from '../../../../../resolvers/admin/presets-resolver';

import { AdminRoleGuard } from '../../../../../guards/admin-role-guard.service';
// import {AdminUseCasesLibraryComponent} from './admin-use-cases-library/admin-use-cases-library.component';
// import {AdminEditUseCaseComponent} from './admin-use-cases-library/admin-edit-use-case/admin-edit-use-case.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLibrariesComponent,
    children: [
      {
        path: 'workflows',
        component: AdminLibrariesWorkflowsComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['libraries', 'workflows'] }
      },
      {
        path: 'emails',
        component: AdminEmailsLibraryComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['libraries', 'emails'] }
      },
      {
        path: 'signatures',
        component: AdminSignaturesLibraryComponent,
        resolve: { signatures: SignaturesResolver },
        runGuardsAndResolvers: 'always',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['libraries', 'signatures'] },
        pathMatch: 'full',
      },
      /*{ path: 'questionnaire', children: [
         { path: '', component: AdminPresetsListComponent, pathMatch: 'full' },
         { path: '/new', component: AdminPresetsNewComponent, pathMatch: 'full' },
         { path: '/:presetId', component: AdminPresetsEditComponent, resolve: {preset: PresetResolver}, pathMatch: 'full' }
       ]},
     */
      {
        path: 'questionnaire',
        component: AdminPresetsListComponent,
        resolve: { presets: PresetsResolver },
        runGuardsAndResolvers: 'always',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['libraries', 'questionnaire'] },
        pathMatch: 'full',
      },
      {
        path: 'questionnaire/:presetId',
        component: AdminPresetsEditComponent,
        resolve: { preset: PresetResolver },
        runGuardsAndResolvers: 'always',
        pathMatch: 'full',
      },
      /*{
        path: 'use-cases',
        component: AdminUseCasesLibraryComponent,
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['libraries', 'useCases'] },
        pathMatch: 'full'
      },
      {
        path: 'use-cases/:templateId',
        component: AdminEditUseCaseComponent,
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['libraries', 'useCases'] },
        pathMatch: 'full'
      }*/
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

export class AdminLibrariesRoutingModule {}
