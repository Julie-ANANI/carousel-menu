import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ForgetPasswordComponent} from './forget-password.component';

const routes: Routes = [
  { path: '', component: ForgetPasswordComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class ForgetPasswordRoutingModule {}
