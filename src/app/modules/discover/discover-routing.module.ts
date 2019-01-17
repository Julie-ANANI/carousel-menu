import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverComponent } from './discover.component';
import { DiscoverDescriptionComponent } from './components/description/discover-description.component';
import { InnovationResolver } from '../../resolvers/innovation.resolver';
import { InnovationsResolver } from './services/innovations.resolver';

const discoverRoutes: Routes = [
  {
    path: '',
    component: DiscoverComponent,
    resolve: { innovations: InnovationsResolver },
    pathMatch: 'full',
  },
  {
    path: 'result',
      children: [
      {
        path: '',
        component: DiscoverComponent,
        resolve: { innovations: InnovationsResolver },
        pathMatch: 'full'
      },
      {
        path: ':projectId/:lang',
        component: DiscoverDescriptionComponent,
        resolve: { innovation: InnovationResolver },
        pathMatch: 'full'
      }
    ]
  },
  {
    path: ':projectId/:lang',
    component: DiscoverDescriptionComponent,
    resolve: { innovation: InnovationResolver },
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(discoverRoutes)
  ],
  providers: [
    InnovationResolver,
    InnovationsResolver
  ],
  exports: [
    RouterModule
  ]
})

export class DiscoverRoutingModule {}
