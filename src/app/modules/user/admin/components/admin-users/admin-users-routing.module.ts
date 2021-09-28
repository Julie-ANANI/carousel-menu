import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AdminUsersComponent} from './admin-users.component';
import {AdminRoleGuard} from '../../../../../guards/admin-role-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AdminUsersComponent,
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['users'] },
    pathMatch: 'full'
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

export class AdminUsersRoutingModule { }
