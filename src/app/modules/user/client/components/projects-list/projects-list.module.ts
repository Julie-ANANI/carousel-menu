import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {ProjectsListComponent} from './projects-list.component';
import {ProjectsListRoutingModule} from './projects-list-routing.module';
import {ModalModule, PaginationModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ProjectsListRoutingModule,
    PaginationModule,
    ModalModule
  ],
  declarations: [
    ProjectsListComponent,
  ],
  exports: [
    ProjectsListComponent
  ]
})

export class ProjectsListModule { }
