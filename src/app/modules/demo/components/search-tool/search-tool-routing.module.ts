import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchToolComponent } from './search-tool.component';

const searchToolRoutes: Routes = [
  {
    path: '',
    component: SearchToolComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' }
    ]
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(searchToolRoutes)
  ],
  providers: [

  ],
  exports: [
    RouterModule
  ]
})

export class SearchToolRoutingModule {}
