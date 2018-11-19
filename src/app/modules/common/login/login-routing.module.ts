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
    canActivate: [NonAuthGuard],
    children: [
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'forgetpassword', component: ForgetPasswordComponent, pathMatch: 'full' },
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
