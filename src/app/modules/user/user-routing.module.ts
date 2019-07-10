import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

import { UserService } from '../../services/user/user.service';
import { AuthGuard } from '../../guards/auth-guard.service';
import { DocsCssGuardService } from '../../guards/docs-css-guard.service';

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
        path: 'documentation/framework/css',
        canActivateChild: [DocsCssGuardService],
        loadChildren: './../documentation/docs-css/docs-css.module#DocsCssModule'
      },
      {
        path: '',
        canActivateChild: [AuthGuard],
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
    UserService,
    AuthGuard,
    DocsCssGuardService
  ],
  exports: [
    RouterModule
  ]
})

export class UserRoutingModule { }
