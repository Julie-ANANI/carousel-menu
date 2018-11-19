import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { PrivateComponent } from './private.component';

const privateRoutes: Routes = [
  { path: '',
    component: PrivateComponent,
    children: [
      { path: 'client', loadChildren: './modules/private/client/client.module#ClientModule' },
      { path: 'admin', loadChildren: './modules/private/admin/admin.module#AdminModule' },
      { path: '', pathMatch: 'full', redirectTo: 'client' },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(privateRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})

export class PrivateRoutingModule {}
