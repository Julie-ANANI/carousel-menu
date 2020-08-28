import { Routes } from '@angular/router';

import { AdminEmailBlacklistComponent } from './admin-email-blacklist/admin-email-blacklist.component';
import { AdminCountryManagementComponent } from './admin-country-management/admin-country-management.component';
import { AdminEnterpriseManagementComponent } from "./admin-enterprise-management/admin-enterprise-management.component";

import { AdminRoleGuard } from '../../../../../guards/admin-role-guard.service';

export const settingsRoutes: Routes = [
  // { path: '', redirectTo: 'blacklist', pathMatch: 'full'},
  {
    path: 'blacklist',
    component: AdminEmailBlacklistComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['settings', 'blacklist'] }
  },
  {
    path: 'countries',
    component: AdminCountryManagementComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['settings', 'countries'] }
  },
  {
    path: 'enterprises',
    component: AdminEnterpriseManagementComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['settings', 'enterprises'] }
  },
];
