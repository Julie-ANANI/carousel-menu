import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverComponent } from './discover.component';
import { DiscoverDescriptionComponent } from './components/description/discover-description.component';
import { InnovationsResolver } from './services/innos-resolver.service';

const discoverRoutes: Routes = [
  {
    path: '',
    component: DiscoverComponent,
    resolve: { innovations: InnovationsResolver },
    pathMatch: 'full',
  },
  {
    path: ':id/:lang',
    component: DiscoverDescriptionComponent,
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
    InnovationsResolver
  ],
  exports: [
    RouterModule
  ]
})

export class DiscoverRoutingModule {}
