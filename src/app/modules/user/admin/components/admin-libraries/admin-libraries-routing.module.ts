import { Routes } from '@angular/router';

import { AdminWorkflowsLibraryComponent } from './admin-workflows-library/admin-workflows-library.component';
import { AdminSignaturesLibraryComponent } from './admin-signatures-library/admin-signatures-library.component';
import { AdminEmailsLibraryComponent } from './admin-emails-library/admin-emails-library.component';
import { AdminPresetsListComponent } from './admin-presets/admin-presets-list/admin-presets-list.component';
import { AdminPresetsNewComponent } from './admin-presets/admin-presets-new/admin-presets-new.component';
import { AdminPresetsEditComponent } from './admin-presets/admin-presets-edit/admin-presets-edit.component';

import { PresetResolver } from '../../../../../resolvers/preset.resolver';
import { SignaturesResolver } from '../../../../../resolvers/admin/signatures-resolver';
import { PresetsResolver } from '../../../../../resolvers/admin/presets-resolver';

export const librariesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'workflows',
    pathMatch: 'full'
  },
  {
    path: 'workflows',
    component: AdminWorkflowsLibraryComponent,
    pathMatch: 'full'
  },
  {
    path: 'emails',
    component: AdminEmailsLibraryComponent,
    pathMatch: 'full'
  },
  {
    path: 'signatures',
    component: AdminSignaturesLibraryComponent,
    pathMatch: 'full',
    resolve: { signatures: SignaturesResolver },
    runGuardsAndResolvers: 'always'
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
    pathMatch: 'full',
    resolve: { presets: PresetsResolver },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'questionnaire/new',
    component: AdminPresetsNewComponent,
    pathMatch: 'full'
  },
  {
    path: 'questionnaire/:presetId',
    component: AdminPresetsEditComponent,
    resolve: { preset: PresetResolver },
    pathMatch: 'full'
  }

];
