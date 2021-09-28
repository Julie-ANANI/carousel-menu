import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAuthGuard } from '../../../guards/admin-auth-guard.service';

const adminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'projects',
        canActivate: [AdminAuthGuard],
        loadChildren: './components/admin-projects/admin-projects.module#AdminProjectsModule'
      },
      {
        path: 'users',
        canActivate: [AdminAuthGuard],
        loadChildren: './components/admin-users/admin-users.module#AdminUsersModule'
      },
      {
        path: 'professionals',
        canActivate: [AdminAuthGuard],
        loadChildren: './components/admin-professionals/admin-professionals.module#AdminProfessionalsModule'
      },
      {
        path: 'libraries',
        canActivate: [AdminAuthGuard],
        loadChildren: './components/admin-libraries/admin-libraries.module#AdminLibrariesModule'
      },
      {
        path: 'settings',
        canActivate: [AdminAuthGuard],
        loadChildren: './components/admin-settings/admin-settings.module#AdminSettingsModule'
      },
      {
        path: 'search',
        canActivate: [AdminAuthGuard],
        loadChildren: './components/admin-search/admin-search.module#AdminSearchModule'
      },
      {
        path: 'tags',
        canActivateChild: [AdminAuthGuard],
        loadChildren: './components/admin-tags/admin-tag.module#AdminTagModule'
      },
      {
        path: 'monitoring',
        canActivate: [AdminAuthGuard],
        loadChildren: './components/admin-monitoring/admin-monitoring.module#AdminMonitoringModule'
      },
      {
        path: 'community',
        canActivate: [AdminAuthGuard],
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
