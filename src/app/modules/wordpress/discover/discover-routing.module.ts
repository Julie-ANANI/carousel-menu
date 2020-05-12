import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverComponent } from './discover.component';
import { InnovationsComponent } from './components/innovations/innovations.component';
import { DiscoverDescriptionComponent } from './components/description/discover-description.component';

import { InnovationResolver } from '../../../resolvers/innovation.resolver';

const discoverRoutes: Routes = [
  {
    path: '',
    component: DiscoverComponent,
    children: [
      {
        path: ':lang',
        component: InnovationsComponent,
        pathMatch: 'full',
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
    path: '**',
    redirectTo: ''
  }
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
