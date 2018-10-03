import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


/***
 *  Guards
 */
import { NonAuthGuard } from '../../guards/non-auth-guard.service';


/***
 * Components
 */
import { SynthesisCompleteComponent } from './component/synthesis-complete/synthesis-complete.component';
import { ShareComponent } from './share.component';


const shareRoutes: Routes = [
  {
    path: '',
    component: ShareComponent,
    canActivate: [NonAuthGuard],
    children: [
      { path: 'synthesis/:projectId/:userKey',
        component: SynthesisCompleteComponent,
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '/login'
      }
    ]
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(shareRoutes)
  ],
  providers: [],
  exports: [
    RouterModule
  ]
})

export class ShareRoutingModule {}
