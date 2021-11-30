import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SynthesisCompleteComponent } from './component/synthesis-complete/synthesis-complete.component';
import { ShareComponent } from './share.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ShareComponent,
        children: [
          {
            path: 'synthesis/:projectId/:shareKey',
            component: SynthesisCompleteComponent,
            pathMatch: 'full'
          }
        ]
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class ShareRoutingModule {}
