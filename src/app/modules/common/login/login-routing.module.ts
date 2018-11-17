import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { NonAuthGuard } from "../../../guards/non-auth-guard.service";

// Components
import { LoginComponent } from "./login.component";
import { ForgetPasswordComponent } from "./components/forget-password/forget-password.component";

const loginRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', canActivate: [NonAuthGuard], component: LoginComponent, pathMatch: 'full' },
      { path: 'forgetpassword', canActivate: [NonAuthGuard], component: ForgetPasswordComponent, pathMatch: 'full' }
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
