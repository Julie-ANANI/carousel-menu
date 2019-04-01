import { NgModule } from '@angular/core';
import { ExtraOptions, Routes, RouterModule } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

// Guards
import { AdminAuthGuard } from './guards/admin-auth-guard.service';
import { NonAuthGuard } from './guards/non-auth-guard.service';
import { AuthGuard } from './guards/auth-guard.service';
import { DiscoverGuard } from './modules/public/discover/guards/discover-guard.service';
import { ShareSynthesisGuard } from './modules/public/share/guards/share-synthesis-guard.service';

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
    path: 'discover', canActivate: [DiscoverGuard], loadChildren: './modules/public/discover/discover.module#DiscoverModule'
  },
  {
    path: 'share', canActivate: [ShareSynthesisGuard], loadChildren: './modules/public/share/share.module#ShareModule'
  },
  {
    path: 'wordpress/discover', loadChildren: './modules/wordpress/discover/discover.module#DiscoverModule'
  },
  {
    path: 'wordpress/share', loadChildren: './modules/wordpress/share/share.module#ShareModule'
  },
  {
    path: 'sample', loadChildren: './modules/public/share/share.module#ShareModule'
  },
  {
    path: 'auth', loadChildren: './modules/authentication/authentication.module#AuthenticationModule'
  },
  {
    path: 'user', canActivate: [AuthGuard], loadChildren: './modules/user/user.module#UserModule'
  },
  {
    path: 'showcase', canActivate: [AuthGuard, AdminAuthGuard], loadChildren: './modules/showcase/showcase.module#ShowcaseModule'
  },
  {
    path: '', pathMatch: 'full', redirectTo: 'user'
  },
  {
    path: '**', component: NotFoundComponent
  },
];

const config: ExtraOptions = {
  initialNavigation: 'enabled',
  scrollPositionRestoration: 'enabled'
};

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, config)
  ],
  exports: [
    RouterModule
  ],
  providers: [ // /!\ Ne mettre ici que les service liés au routage (utilisés par un Guard), sinon les mettre dans app.module.ts
    AuthService,
    AuthGuard,
    NonAuthGuard,
    AdminAuthGuard,
    DiscoverGuard,
    ShareSynthesisGuard
  ]
})

export class AppRoutingModule {}
