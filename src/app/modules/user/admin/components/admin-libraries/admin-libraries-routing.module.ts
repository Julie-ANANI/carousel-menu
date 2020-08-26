import { Routes } from '@angular/router';

import { AdminLibrariesWorkflowsComponent } from './admin-libraries-workflows/admin-libraries-workflows.component';
import { AdminSignaturesLibraryComponent } from './admin-signatures-library/admin-signatures-library.component';
import { AdminEmailsLibraryComponent } from './admin-emails-library/admin-emails-library.component';
import { AdminPresetsListComponent } from './admin-presets/admin-presets-list/admin-presets-list.component';
import { AdminPresetsEditComponent } from './admin-presets/admin-presets-edit/admin-presets-edit.component';

import { PresetResolver } from '../../../../../resolvers/preset.resolver';
import { SignaturesResolver } from '../../../../../resolvers/admin/signatures-resolver';
import { PresetsResolver } from '../../../../../resolvers/admin/presets-resolver';

import { AdminRoleGuard } from '../../../../../guards/admin-role-guard.service';

export const librariesRoutes: Routes = [
  // { path: '', redirectTo: 'workflows', pathMatch: 'full' },
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
    data: { accessPath: ['libraries', 'signatures'] }
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
    data: { accessPath: ['libraries', 'questionnaire'] }
  },
  {
    path: 'questionnaire/:presetId',
    component: AdminPresetsEditComponent,
    resolve: { preset: PresetResolver },
    runGuardsAndResolvers: 'always'
  }

];
