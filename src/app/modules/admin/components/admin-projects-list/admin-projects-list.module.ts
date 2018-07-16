// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSortModule } from '../../../shared/components/shared-sort/sort.module';
import { SharedFilterInputModule } from '../../../shared/components/shared-filter-input/filter-input.module';
import { SharedPaginationModule } from '../../../shared/components/shared-pagination/pagination.module';

// Components
import {ProjectsListComponent} from '../../../client/components/client-project/components/projects-list/projects-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedSortModule,
    RouterModule,
    SharedFilterInputModule,
    SharedPaginationModule,
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
