import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSortModule } from '../../../shared/components/shared-sort/shared-sort.module';
import { SharedFilterInputModule } from '../../../shared/components/shared-filter-input/shared-filter-input.module';
import {ProjectsListComponent} from '../../../client/components/client-project/components/projects-list/projects-list.component';
import { InputModule } from '../../../input/input.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedSortModule,
    RouterModule,
    SharedFilterInputModule,
    InputModule,
    TranslateModule.forChild()
  ],
  declarations: [
    ProjectsListComponent
  ],
  exports: [
    ProjectsListComponent
  ]
})

export class SharedProjectsListModule { }
