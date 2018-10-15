import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverComponent } from './discover.component';
import { DiscoverDescriptionComponent } from './components/description/discover-description.component';

const discoverRoutes: Routes = [
  {
    path: '',
    component: DiscoverComponent,
    pathMatch: 'full'
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
  exports: [
    RouterModule
  ]
})

export class DiscoverRoutingModule {}
