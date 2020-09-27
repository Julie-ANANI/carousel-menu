import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAuthGuard } from '../../../guards/admin-auth-guard.service';
import { AdminRoleGuard } from '../../../guards/admin-role-guard.service';

const adminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'projects',
        canActivateChild: [AdminAuthGuard],
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['projects'] },
        loadChildren: './components/admin-projects/admin-projects.module#AdminProjectsModule'
      },
      {
        path: 'users',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['users'] },
        loadChildren: './components/admin-users/admin-users.module#AdminUsersModule'
      },
      {
        path: 'professionals',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['professionals'] },
        loadChildren: './components/admin-professionals/admin-professionals.module#AdminProfessionalsModule'
      },
      {
        path: 'libraries',
        canActivateChild: [AdminAuthGuard],
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['libraries'] },
        loadChildren: './components/admin-libraries/admin-libraries.module#AdminLibrariesModule'
      },
      {
        path: 'settings',
        canActivateChild: [AdminAuthGuard],
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['settings'] },
        loadChildren: './components/admin-settings/admin-settings.module#AdminSettingsModule'
      },
      {
        path: 'search',
        canActivateChild: [AdminAuthGuard],
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['search'] },
        loadChildren: './components/admin-search/admin-search.module#AdminSearchModule'
      },
      {
        path: 'tags',
        canActivateChild: [AdminAuthGuard],
        loadChildren: './components/admin-tags/admin-tag.module#AdminTagModule'
      },
      {
        path: 'monitoring',
        canActivateChild: [AdminAuthGuard],
        loadChildren: './components/admin-monitoring/admin-monitoring.module#AdminMonitoringModule'
      },
      {
        path: 'community',
        canActivateChild: [AdminAuthGuard],
        loadChildren: './components/admin-community/admin-community.module#AdminCommunityModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminRoutingModule {}
