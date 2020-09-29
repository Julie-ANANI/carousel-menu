import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AdminProfessionalsComponent} from './admin-professionals.component';

const routes: Routes = [
  { path: '', component: AdminProfessionalsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminProfessionalsRoutingModule { }
