import { Routes } from '@angular/router';
import {AdminWorkflowsLibraryComponent} from "./admin-workflows-library/admin-workflows-library.component";
import {AdminSignaturesLibraryComponent} from "./admin-signatures-library/admin-signatures-library.component";
import {AdminPresetComponent} from './admin-preset/admin-preset.component';

export const librariesRoutes: Routes = [
  { path: '', redirectTo: 'workflows', pathMatch: 'full'},
  { path: 'workflows', component: AdminWorkflowsLibraryComponent, pathMatch: 'full'},
  { path: 'signatures', component: AdminSignaturesLibraryComponent, pathMatch: 'full'},
  { path: 'questionnaire', component: AdminPresetComponent, pathMatch: 'full' }
];
