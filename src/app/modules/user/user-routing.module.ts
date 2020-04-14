import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

import { AuthGuard } from '../../guards/auth-guard.service';

const userRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: UserComponent,
    children: [
      {
        path: 'admin',
        canActivateChild: [AuthGuard],
        loadChildren: './admin/admin.module#AdminModule'
      },
      {
        path: '',
        loadChildren: './client/client.module#ClientModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  providers: [
    AuthGuard
  ],
  exports: [
    RouterModule
  ]
})

export class UserRoutingModule { }
