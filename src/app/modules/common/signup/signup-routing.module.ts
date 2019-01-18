import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { SignupComponent } from "./signup.component";

const signupRoutes: Routes = [
  { path: '', component: SignupComponent, pathMatch: 'full' }
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
