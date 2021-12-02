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
        loadChildren: () => import('../../.././modules/common/login/components/forget-password/forget-password.module')
          .then(m => m.ForgetPasswordModule)
      },
      {
        path: 'resetpassword/:tokenEmail',
        loadChildren: () => import('../../.././modules/common/login/components/reset-password/reset-password.module')
          .then(m => m.ResetPasswordModule)
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
