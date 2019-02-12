import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from "./login.component";
import { ForgetPasswordComponent } from "./components/forget-password/forget-password.component";
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const loginRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'forgetpassword', component: ForgetPasswordComponent, pathMatch: 'full' },
      { path: 'resetpassword/:tokenEmail', component: ResetPasswordComponent, pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})

export class LoginRoutingModule {}
