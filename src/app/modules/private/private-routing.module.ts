import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// Guards


// Components
import { PrivateComponent } from './private.component';

const privateRoutes: Routes = [
  { path: '', component: PrivateComponent, canActivate: [], pathMatch: 'full' }
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
