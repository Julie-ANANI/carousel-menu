import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { NonAuthGuard } from './non-auth-guard.service';
import { AuthGuard } from './auth-guard.service';
import { PendingChangesGuard } from './pending-changes-guard.service';

const appRoutes: Routes = [
  {
    path: 'admin',
   loadChildren: './modules/admin/admin.module#AdminModule'
  },
  {
    path: '',
    loadChildren: './modules/client/client.module#ClientModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: true}) // TODO {useHash: true} annule le fonctionnement des ancres
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
    PendingChangesGuard
  ]
})
export class AppRoutingModule { }
