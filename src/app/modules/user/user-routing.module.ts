import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { UserComponent } from './user.component';

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
    UserService
  ],
  exports: [
    RouterModule
  ]
})

export class UserRoutingModule {}
