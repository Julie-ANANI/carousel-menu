import { Routes } from '@angular/router';
import { AdminNewScenarioComponent } from './admin-new-scenario/admin-new-scenario.component';
import { AdminEditScenarioComponent } from './admin-edit-scenario/admin-edit-scenario.component';
import { AdminEditSignatureComponent } from './admin-edit-signature/admin-edit-signature.component';

export const emailsTemplatesRoutes: Routes = [
  { path: '', redirectTo: 'new', pathMatch: 'full'},
  { path: 'new', component: AdminNewScenarioComponent, pathMatch: 'full' },
  { path: 'scenario/:scenarioId', component: AdminEditScenarioComponent, pathMatch: 'full' },
  { path: 'signature/:signatureId', component: AdminEditSignatureComponent, pathMatch: 'full' }
];
