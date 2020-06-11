import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicDiscoverComponent } from './public-discover.component';
import { PublicDiscoverInnovationsComponent } from './components/public-discover-innovations/public-discover-innovations.component';
import { PublicDiscoverDescriptionComponent } from './components/public-discover-description/public-discover-description.component';

import { InnovationResolver } from '../../../resolvers/innovation.resolver';

const discoverRoutes: Routes = [
  {
    path: '',
    component: PublicDiscoverComponent,
    children: [
      { path: '', component: PublicDiscoverInnovationsComponent, pathMatch: 'full' },
      {
        path: ':projectId/:lang',
        component: PublicDiscoverDescriptionComponent,
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

export class PublicDiscoverRoutingModule { }
