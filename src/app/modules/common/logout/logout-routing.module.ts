import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LogoutComponent } from './logout.component';

const logoutRoutes: Routes = [
  { path: '', component: LogoutComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(logoutRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})

export class LogoutRoutingModule {}
