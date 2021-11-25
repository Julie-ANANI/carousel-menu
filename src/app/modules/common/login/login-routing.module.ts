import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: LoginComponent, pathMatch: 'full' },
      {
        path: 'forgetpassword',
        loadChildren: '../../.././modules/common/login/components/forget-password/forget-password.module#ForgetPasswordModule',
        data: {
          preload: false
        }
      },
      {
        path: 'resetpassword/:tokenEmail',
        loadChildren: '../../.././modules/common/login/components/reset-password/reset-password.module#ResetPasswordModule',
        data: {
          preload: false
        }
      },
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

export class LoginRoutingModule {}
