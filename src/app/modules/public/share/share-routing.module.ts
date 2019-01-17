import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SynthesisCompleteComponent } from './component/synthesis-complete/synthesis-complete.component';
import { ShareComponent } from './share.component';


const shareRoutes: Routes = [
  {
    path: '',
    component: ShareComponent,
    children: [
      { path: 'synthesis/:projectId/:shareKey',
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
