import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationComponent } from "./authentication.component";
import { NonAuthGuard } from "../../guards/non-auth-guard.service";

const authRoutes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    canActivate: [NonAuthGuard],
    children: [
      {
        path: 'linkedin',
        children: [
          {
            path: 'callback',
            component: AuthenticationComponent,
            data: {what: "yes"},
            pathMatch: 'full'
          }
        ],
      },
      //{ path: '**', component: NotFoundPageComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})

export class AuthenticationRoutingModule {}
