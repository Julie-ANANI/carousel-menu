import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotAuthorizedComponent } from './not-authorized.component';

const notAuthorizedRoutes: Routes = [
  { path: '', component: NotAuthorizedComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(notAuthorizedRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})

export class NotAuthorizedRoutingModule {}
