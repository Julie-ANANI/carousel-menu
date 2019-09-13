import { NgModule } from '@angular/core';
import { ExtraOptions, Routes, RouterModule } from '@angular/router';

// Guards
import { AdminAuthGuard } from './guards/admin-auth-guard.service';
import { NonAuthGuard } from './guards/non-auth-guard.service';
import { AuthGuard } from './guards/auth-guard.service';
import { AdHocAuthGuard } from "./guards/adhoc-auth-guard.service";
import { ShareSynthesisGuard } from './modules/public/share/guards/share-synthesis-guard.service';

// Components
import { NotFoundComponent } from "./modules/common/not-found/not-found.component";

import { demoRoutes } from './modules/demo/demo-routing.module';

const appRoutes: Routes = [
  {
    path: 'login',
    canActivate: [NonAuthGuard],
    loadChildren: './modules/common/login/login.module#LoginModule'
  },
  {
    path: 'register',
    canActivate: [NonAuthGuard],
    loadChildren: './modules/common/signup/signup.module#SignupModule'
  },
  {
    path: 'logout',
    canActivate: [AuthGuard],
    loadChildren: './modules/common/logout/logout.module#LogoutModule'
  },
  {
    path: 'welcome',
    loadChildren: './modules/common/welcome/welcome.module#WelcomeModule'
  },
  {
    path: 'discover',
    loadChildren: './modules/public/discover/discover.module#DiscoverModule'
  },
  {
    path: 'share',
    canActivate: [ShareSynthesisGuard],
    loadChildren: './modules/public/share/share.module#ShareModule'
  },
  {
    path: 'wordpress/discover',
    loadChildren: './modules/wordpress/discover/discover.module#DiscoverModule'
  },
  {
    path: 'sample',
    loadChildren: './modules/public/share/share.module#ShareModule'
  },
  {
    path: 'user/discover',
    redirectTo: 'discover'
  },
  {
    path: 'user',
    loadChildren: './modules/user/user.module#UserModule'
  },
  {
    path: 'demo',
    canActivate: [AuthGuard, AdHocAuthGuard],
    children: [ ...demoRoutes ]
  },
  {
    path: 'documentation',
    loadChildren: './modules/documentation/documentation.module#DocumentationModule'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user'
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

const config: ExtraOptions = {
  initialNavigation: 'enabled',
  scrollPositionRestoration: 'top',
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, config)
  ],
  exports: [
    RouterModule
  ],
  providers: [ // /!\ Ne mettre ici que les service liés au routage (utilisés par un Guard), sinon les mettre dans app.module.ts
    AuthGuard,
    NonAuthGuard,
    AdminAuthGuard,
    AdHocAuthGuard,
    ShareSynthesisGuard
  ]
})

export class AppRoutingModule {}
