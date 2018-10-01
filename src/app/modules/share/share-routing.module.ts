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
import { SynthesisListComponent } from './component/synthesis-list/synthesis-list.component';
import { SynthesisCompleteComponent } from './component/synthesis-complete/synthesis-complete.component';


const shareRoutes: Routes = [
  {
    path: 'synthesis',
    children: [
      { path: '', component: SynthesisListComponent, pathMatch: 'full',  canActivate: [AuthGuard] },
      { path: ':projectId/:userKey', component: SynthesisCompleteComponent, pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
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
