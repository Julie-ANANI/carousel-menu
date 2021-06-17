import { NgModule } from '@angular/core';
import { ExtraOptions, Routes, RouterModule } from '@angular/router';

import { NonAuthGuard } from './guards/non-auth-guard.service';
import { AuthGuard } from './guards/auth-guard.service';
import { AdHocAuthGuard } from './guards/adhoc-auth-guard.service';
import { ShareSynthesisGuard } from './guards/share-synthesis-guard.service';
import { NotFoundComponent } from './modules/errors/not-found/not-found.component';
import { demoRoutes } from './modules/demo/demo-routing.module';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'user' },
  { path: 'login', canActivate: [NonAuthGuard], loadChildren: './modules/common/login/login.module#LoginModule' },
  { path: 'user', loadChildren: './modules/user/user.module#UserModule' },
  { path: 'register', canActivate: [NonAuthGuard], loadChildren: './modules/common/signup/signup.module#SignupModule' },
  { path: 'welcome', loadChildren: './modules/common/welcome/welcome.module#WelcomeModule' },
  { path: 'discover', loadChildren: './modules/public/discover/discover.module#DiscoverModule' },
  { path: 'share', canActivate: [ShareSynthesisGuard], loadChildren: './modules/public/share/share.module#ShareModule' },
  { path: 'sample', loadChildren: './modules/public/share/share.module#ShareModule' },
  { path: 'demo', canActivate: [AuthGuard, AdHocAuthGuard], children: [ ...demoRoutes ] },
  { path: 'logout', canActivate: [AuthGuard], loadChildren: './modules/common/logout/logout.module#LogoutModule' },
  { path: 'documentation', loadChildren: './modules/documentation/documentation.module#DocumentationModule' },
  { path: 'monitoring', loadChildren: './modules/monitoring/monitoring.module#MonitoringModule' },
  {
    path: 'not-authorized',
    canActivate: [AuthGuard],
    loadChildren: './modules/errors/not-authorized/not-authorized.module#NotAuthorizedModule'
  },
  { path: '**', component: NotFoundComponent },
];

const config: ExtraOptions = {
  initialNavigation: 'enabled',
  scrollPositionRestoration: 'top',
  onSameUrlNavigation: 'reload',
  anchorScrolling: 'enabled'
};

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, config)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
