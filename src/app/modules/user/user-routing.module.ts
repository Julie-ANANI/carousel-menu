import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserComponent} from './user.component';

const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', loadChildren: './client/client.module#ClientModule' }
    ]

  }
];


@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})

export class UserRoutingModule {}
