import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// Guards
import { AuthGuard } from '../../../guards/auth-guard.service';


// Components
import { LogoutComponent } from './logout.component';

const logoutRoutes: Routes = [
  { path: '', component: LogoutComponent, canActivate: [AuthGuard], pathMatch: 'full' }
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
