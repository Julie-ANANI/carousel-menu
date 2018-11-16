import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*
  Guards
*/
import { NonAuthGuard } from "../../guards/non-auth-guard.service";


/*
  Components
*/
import { SignupComponent } from "./signup.component";

const signupRoutes: Routes = [
  {
    path: '', component: SignupComponent, canActivate: [NonAuthGuard], pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(signupRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})

export class SignupRoutingModule {}
