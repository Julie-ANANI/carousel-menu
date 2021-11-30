import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {ProjectsListComponent} from './projects-list.component';
import {ProjectsListRoutingModule} from './projects-list-routing.module';
import {PaginationTemplate2Module} from '../../../../utility/paginations/pagination-template-2/pagination-template-2.module';
import {ModalModule} from '../../../../utility/modals/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ProjectsListRoutingModule,
    PaginationTemplate2Module,
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
