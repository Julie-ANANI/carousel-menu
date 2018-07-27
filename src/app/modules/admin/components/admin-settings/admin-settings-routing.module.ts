import { Routes } from '@angular/router';
import {AdminEmailBlacklistComponent} from '../admin-settings/admin-email-blacklist/admin-email-blacklist.component';
import {AdminCountryManagementComponent} from '../admin-settings/admin-country-management/admin-country-management.component';

export const settingsRoutes: Routes = [
  { path: '', redirectTo: 'blacklist', pathMatch: 'full'},
  { path: 'blacklist', component: AdminEmailBlacklistComponent, pathMatch: 'full' },
  { path: 'countries', component: AdminCountryManagementComponent, pathMatch: 'full'}
];
