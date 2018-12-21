import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';

import { UserComponent } from './user.component';

const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', loadChildren: './client/client.module#ClientModule' },
      { path: 'discover', loadChildren: '../public/discover/discover.module#DiscoverModule' },
      { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }
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

export class UserRoutingModule { }
