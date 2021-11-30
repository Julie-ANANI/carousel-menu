import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {SynthesisListComponent} from './synthesis-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SynthesisListComponent, pathMatch: 'full' }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class SynthesisListRoutingModule {}
