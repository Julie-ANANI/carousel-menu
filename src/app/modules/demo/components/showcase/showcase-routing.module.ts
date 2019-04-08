import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowcaseComponent } from './showcase.component';

import { TagsResolver } from './services/tags-resolver.service';

const showcaseRoutes: Routes = [
  {
    path: '',
    component: ShowcaseComponent,
    resolve: { tags: TagsResolver }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(showcaseRoutes)
  ],
  providers: [
    TagsResolver
  ],
  exports: [
    RouterModule
  ]
})

export class ShowcaseRoutingModule { }
