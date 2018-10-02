import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


/***
 *  Guards
 */
import { AuthGuard } from '../../guards/auth-guard.service';


/***
 * Components
 */
import { NotFoundPageComponent } from '../base/components/not-found-page/not-found-page.component';
import { SynthesisCompleteComponent } from './component/synthesis-complete/synthesis-complete.component';
import { ShareComponent } from './share.component';


const shareRoutes: Routes = [
  {
    path: '',
    component: ShareComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [AuthGuard],
        redirectTo: '/login'
      },
      { path: 'synthesis/:projectId/:userKey',
        component: SynthesisCompleteComponent,
        pathMatch: 'full'
      },
      {
        path: '**',
        component: NotFoundPageComponent
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
