import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NewProjectComponent} from './new-project.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: NewProjectComponent, pathMatch: 'full' }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class NewProjectRoutingModule {}
