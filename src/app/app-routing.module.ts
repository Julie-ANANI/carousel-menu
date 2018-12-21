import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

// Guards
import { AdminAuthGuard } from './guards/admin-auth-guard.service';
import { NonAuthGuard } from './guards/non-auth-guard.service';
import { AuthGuard } from './guards/auth-guard.service';

// Component
import { NotFoundComponent } from "./modules/common/not-found/not-found.component";

const appRoutes: Routes = [
  {
    path: 'login', canActivate: [NonAuthGuard], loadChildren: './modules/common/login/login.module#LoginModule'
  },
  {
    path: 'register', canActivate: [NonAuthGuard], loadChildren: './modules/common/signup/signup.module#SignupModule'
  },
  {
    path: 'logout', canActivate: [AuthGuard], loadChildren: './modules/common/logout/logout.module#LogoutModule'
  },
  {
    path: 'welcome', loadChildren: './modules/common/welcome/welcome.module#WelcomeModule'
  },
  {
    path: 'user/discover', canActivate: [AuthGuard], loadChildren: './modules/public/discover/discover.module#DiscoverModule'
  },
  {
    path: 'discover', loadChildren: './modules/public/discover/discover.module#DiscoverModule'
  },
  {
    path: 'user', canActivate: [AuthGuard], loadChildren: './modules/user/user.module#UserModule'
  },
  {
    path: '', pathMatch: 'full', redirectTo: 'user'
  },
  {
    path: '**', component: NotFoundComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
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
