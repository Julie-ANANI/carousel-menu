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
        loadChildren: () => import('./components/admin-projects/admin-projects.module').then(m => m.AdminProjectsModule)
      },
      {
        path: 'users',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./components/admin-users/admin-users.module').then(m => m.AdminUsersModule)
      },
      {
        path: 'professionals',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./components/admin-professionals/admin-professionals.module')
          .then(m => m.AdminProfessionalsModule)
      },
      {
        path: 'libraries',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./components/admin-libraries/admin-libraries.module').then(m => m.AdminLibrariesModule)
      },
      {
        path: 'settings',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./components/admin-settings/admin-settings.module').then(m => m.AdminSettingsModule)
      },
      {
        path: 'search',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./components/admin-search/admin-search.module').then(m => m.AdminSearchModule)
      },
      {
        path: 'tags',
        canActivateChild: [AdminAuthGuard],
        loadChildren: () => import('./components/admin-tags/admin-tag.module').then(m => m.AdminTagModule)
      },
      {
        path: 'monitoring',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./components/admin-monitoring/admin-monitoring.module').then(m => m.AdminMonitoringModule)
      },
      {
        path: 'community',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./components/admin-community/admin-community.module').then(m => m.AdminCommunityModule)
      },
      {
        path: 'grafana',
        canActivate: [AdminAuthGuard],
        loadChildren: () => import('./components/admin-grafana/admin-grafana.module').then(m => m.AdminGrafanaModule)
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
