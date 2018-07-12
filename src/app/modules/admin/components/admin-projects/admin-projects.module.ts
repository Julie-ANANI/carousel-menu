// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSortModule } from '../../../shared/components/shared-sort/sort.module';
import { SharedFilterInputModule } from '../../../shared/components/shared-filter-input/filter-input.module';
import { SharedPaginationModule } from '../../../shared/components/shared-pagination/pagination.module';

// Components
import {AdminProjectsComponent} from './admin-projects.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedSortModule,
    SharedPaginationModule,
    RouterModule,
    SharedFilterInputModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminProjectsComponent
  ],
  exports: [
    AdminProjectsComponent
  ]
})

export class AdminProjectsModule { }
