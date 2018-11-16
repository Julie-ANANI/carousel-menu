import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

/*
  Guards
*/
import { AdminAuthGuard } from './guards/admin-auth-guard.service';
import { NonAuthGuard } from './guards/non-auth-guard.service';
import { AuthGuard } from './guards/auth-guard.service';

/*
  Component
 */
import { NotFoundPageComponent } from "./modules/not-found/not-found-page.component";

const appRoutes: Routes = [
  {
    path: 'login',
    loadChildren: './modules/login/login.module#LoginModule'
  },
  {
    path: 'signup',
    loadChildren: './modules/signup/signup.module#SignupModule'
  },
  { path: '**', component: NotFoundPageComponent }
  /*{
    path: 'admin',
    loadChildren: './modules/admin/admin.module#AdminModule'
  },
  {
    path: 'discover',
    loadChildren: './modules/discover/discover.module#DiscoverModule'
  },
  {
    path: 'share',
    loadChildren: './modules/share/share.module#ShareModule'
  },
  {
    path: '',
    loadChildren: './modules/client/client.module#ClientModule'
  },
  { path: '**', redirectTo: '' }*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [ // /!\ Ne mettre ici que les service liés au routage (utilisés par un Guard), sinon les mettre dans app.module.ts
    AuthService,
    AuthGuard,
    NonAuthGuard,
    AdminAuthGuard
  ]
})

export class AppRoutingModule {}
