import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowcaseComponent } from './showcase.component';

import { TagsResolver } from './services/tags-resolver.service';
import { TagsStatsResolver } from './services/tags-stats-resolver.service';

const showcaseRoutes: Routes = [
  {
    path: '',
    component: ShowcaseComponent,
    resolve: {
      tags: TagsResolver,
      tagsStats: TagsStatsResolver
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(showcaseRoutes)
  ],
  providers: [
    TagsResolver,
    TagsStatsResolver
  ],
  exports: [
    RouterModule
  ]
})

export class ShowcaseRoutingModule { }
