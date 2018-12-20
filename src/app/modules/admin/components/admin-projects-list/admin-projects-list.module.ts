import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {TableModule} from '../../../table/table.module';
import {AdminProjectsListComponent} from './admin-projects-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminProjectsListComponent
  ],
  exports: [
    AdminProjectsListComponent
  ]
})

export class AdminProjectsListModule { }
