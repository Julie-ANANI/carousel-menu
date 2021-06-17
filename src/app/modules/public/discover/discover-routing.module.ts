import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverComponent } from './discover.component';
import { DiscoverInnovationsComponent } from './components/discover-innovations/discover-innovations.component';
import { DiscoverDescriptionComponent } from './components/discover-description/discover-description.component';

import { InnovationResolver } from '../../../resolvers/innovation.resolver';
import { TagsSectorResolver } from '../../../resolvers/tags-sector-resolver';

const discoverRoutes: Routes = [
  {
    path: '',
    component: DiscoverComponent,
    resolve: {
      tags: TagsSectorResolver,
    },
    children: [
      { path: '', component: DiscoverInnovationsComponent, pathMatch: 'full' },
      {
        path: ':projectId/:lang',
        component: DiscoverDescriptionComponent,
        resolve: { innovation: InnovationResolver },
        runGuardsAndResolvers: 'always',
        pathMatch: 'full'
      },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forChild(discoverRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class DiscoverRoutingModule { }
