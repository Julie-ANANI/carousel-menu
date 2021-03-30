import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AdminEmailBlacklistComponent } from './admin-email-blacklist/admin-email-blacklist.component';
import { AdminCountryManagementComponent } from './admin-country-management/admin-country-management.component';
import { AdminEnterpriseManagementComponent } from './admin-enterprise-management/admin-enterprise-management.component';
import { AdminSettingsComponent } from './admin-settings.component';

import { AdminRoleGuard } from '../../../../../guards/admin-role-guard.service';
import {AdminEntrepriseBulkEditComponent} from './admin-enterprise-management/admin-entreprise-bulk-edit/admin-entreprise-bulk-edit.component';
import {AdminEntrepriseAddParentComponent} from './admin-enterprise-management/admin-entreprise-add-parent/admin-entreprise-add-parent.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminSettingsComponent,
    children: [
      {
        path: 'blocklist',
        component: AdminEmailBlacklistComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['settings', 'blocklist'] }
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
      {
        path: 'enterprises/bulkedit',
        component: AdminEntrepriseBulkEditComponent,
        canActivate: [AdminRoleGuard],
        pathMatch: 'full',
        data: { accessPath: ['settings', 'enterprises'] }
      },
      {
        path: 'enterprises/addparent',
        component: AdminEntrepriseAddParentComponent,
        canActivate: [AdminRoleGuard],
        pathMatch: 'full',
        data: { accessPath: ['settings', 'enterprises'] }
      }
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

export class AdminSettingsRoutingModule {}
