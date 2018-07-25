import { Routes } from '@angular/router';
import {AdminWorkflowsLibraryComponent} from "./admin-workflows-library/admin-workflows-library.component";
import {AdminSignaturesLibraryComponent} from "./admin-signatures-library/admin-signatures-library.component";
import {AdminPresetsListComponent} from './admin-presets/admin-presets-list/admin-presets-list.component';
import {AdminPresetsNewComponent} from './admin-presets/admin-presets-new/admin-presets-new.component';
import {AdminPresetsEditComponent} from './admin-presets/admin-presets-edit/admin-presets-edit.component';
import {PresetResolver} from '../../../../resolvers/preset.resolver';

export const librariesRoutes: Routes = [
  { path: '', redirectTo: 'workflows', pathMatch: 'full'},
  { path: 'workflows', component: AdminWorkflowsLibraryComponent, pathMatch: 'full'},
  { path: 'signatures', component: AdminSignaturesLibraryComponent, pathMatch: 'full'},
  { path: 'questionnaire', children: [
      { path: '', component: AdminPresetsListComponent, pathMatch: 'full' },
      { path: 'new', component: AdminPresetsNewComponent, pathMatch: 'full' },
      { path: '/:presetId', component: AdminPresetsEditComponent, resolve: {preset: PresetResolver}, pathMatch: 'full' }
    ], pathMatch: 'full' },
];
