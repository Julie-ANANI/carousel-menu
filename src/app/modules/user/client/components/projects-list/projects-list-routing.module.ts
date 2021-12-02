import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ProjectsListComponent} from './projects-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ProjectsListComponent, pathMatch: 'full' }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class ProjectsListRoutingModule {}
