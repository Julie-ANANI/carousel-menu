import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommercialComponent } from './commercial.component';

import { TagsResolver } from './services/tags-resolver.service';

const commercialRoutes: Routes = [
  {
    path: '',
    component: CommercialComponent,
    resolve: { tags: TagsResolver }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(commercialRoutes)
  ],
  providers: [
    TagsResolver
  ],
  exports: [
    RouterModule
  ]
})

export class CommercialRoutingModule { }
