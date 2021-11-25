import { NgModule } from '@angular/core';
import { ExtraOptions, Routes, RouterModule } from '@angular/router';

import { NonAuthGuard } from './guards/non-auth-guard.service';
import { AuthGuard } from './guards/auth-guard.service';
import { AdHocAuthGuard } from './guards/adhoc-auth-guard.service';
import { ShareSynthesisGuard } from './guards/share-synthesis-guard.service';
import { NotFoundComponent } from './modules/errors/not-found/not-found.component';
import { demoRoutes } from './modules/demo/demo-routing.module';
import {QuicklinkStrategy} from 'ngx-quicklink';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'user' },
  { path: 'login', canActivate: [NonAuthGuard], loadChildren: './modules/common/login/login.module#LoginModule' },
  { path: 'user', loadChildren: './modules/user/user.module#UserModule' },
  {
    path: 'register',
    canActivate: [NonAuthGuard],
    loadChildren: './modules/common/signup/signup.module#SignupModule',
    data: {preload: false}
  },
  {
    path: 'welcome',
    loadChildren: './modules/common/welcome/welcome.module#WelcomeModule',
    data: {preload: false}
  },
  {
    path: 'discover',
    loadChildren: './modules/public/discover/discover.module#DiscoverModule',
    data: {preload: false}
  },
  {
    path: 'share',
    canActivate: [ShareSynthesisGuard],
    loadChildren: './modules/public/share/share.module#ShareModule',
    data: {preload: false}
  },
  {
    path: 'sample',
    loadChildren: './modules/public/share/share.module#ShareModule',
    data: {preload: false}
  },
  {
    path: 'demo',
    canActivate: [AuthGuard, AdHocAuthGuard],
    children: [ ...demoRoutes ],
    data: {preload: false}
  },
  {
    path: 'logout',
    canActivate: [AuthGuard],
    loadChildren: './modules/common/logout/logout.module#LogoutModule',
    data: {preload: false}
  },
  {
    path: 'monitoring',
    loadChildren: './modules/monitoring/monitoring.module#MonitoringModule',
    data: {preload: false}
  },
  {
    path: 'not-authorized',
    canActivate: [AuthGuard],
    loadChildren: './modules/errors/not-authorized/not-authorized.module#NotAuthorizedModule',
    data: {preload: false}
  },
  { path: '**', component: NotFoundComponent },
];

/**
 * Remember: to work perfectly of the QuicklinkStrategy you need to import and export the module 'QuicklinkModule'
 * in the modules if and only that contains the link and its need to <a> tag.
 * More info: npmjs.com/package/ngx-quicklink
 */
const config: ExtraOptions = {
  initialNavigation: 'enabled',
  scrollPositionRestoration: 'top',
  onSameUrlNavigation: 'reload',
  anchorScrolling: 'enabled',
  preloadingStrategy: QuicklinkStrategy
};

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, config)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
