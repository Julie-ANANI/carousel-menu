import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverComponent } from './discover.component';
import { DiscoverDescriptionComponent } from './components/description/discover-description.component';
import { InnovationsComponent} from './components/innovations/innovations.component';

import { InnovationsResolver } from './services/innos-resolver.service';
import { InnovationResolver } from './services/inno-resolver.service';


const discoverRoutes: Routes = [
  {
    path: '',
    component: DiscoverComponent,
    children: [
      {
        path: '',
        component: InnovationsComponent,
        resolve: { innovations: InnovationsResolver },
        pathMatch: 'full',
      },
      {
        path: ':id/:lang',
        component: DiscoverDescriptionComponent,
        resolve: { innovation: InnovationResolver },
        pathMatch: 'full'
      },
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
  providers: [
    InnovationResolver,
    InnovationsResolver
  ],
  exports: [
    RouterModule
  ]
})

export class DiscoverRoutingModule { }
