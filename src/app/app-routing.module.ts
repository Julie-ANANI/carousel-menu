import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

/* Guards */
import { AdminAuthGuard } from './guards/admin-auth-guard.service';
import { NonAuthGuard } from './guards/non-auth-guard.service';
import { AuthGuard } from './guards/auth-guard.service';

const appRoutes: Routes = [
  {
    path: 'admin',
   loadChildren: './modules/admin/admin.module#AdminModule'
  },
  {
    path: 'share',
    loadChildren: './modules/share/share.module#ShareModule'
  },
  {
    path: '',
    loadChildren: './modules/client/client.module#ClientModule'
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [],
  providers: [ // /!\ Ne mettre ici que les service liés au routage (utilisés par un Guard), sinon les mettre dans app.module.ts
    AuthService,
    // Guards :
    AuthGuard,
    NonAuthGuard,
    AdminAuthGuard
  ]
})

export class AppRoutingModule { }
