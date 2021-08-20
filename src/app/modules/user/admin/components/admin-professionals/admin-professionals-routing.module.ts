import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AdminProfessionalsComponent} from './admin-professionals.component';
import {AdminProfessionalsListComponent} from './admin-professionals-list/admin-professionals-list.component';
import {AdminProfessionalsStatisticsComponent} from './admin-professionals-statistics/admin-professionals-statistics.component';
import {AdminRoleGuard} from '../../../../../guards/admin-role-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AdminProfessionalsComponent,
    children: [
      {
        path: 'list',
        component: AdminProfessionalsListComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: {accessPath: ['professionals', 'list']}
      },
      {
        path: 'statistics',
        component: AdminProfessionalsStatisticsComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: {accessPath: ['professionals', 'statistics']}
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

export class AdminProfessionalsRoutingModule {
}
