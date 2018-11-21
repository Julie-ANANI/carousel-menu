import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClientRoutingModule } from './client-routing.module';

import { ClientComponent } from './client.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';

import { PaginationModule } from '../../input/component/pagination/pagination.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ClientRoutingModule,
    PaginationModule
  ],
  declarations: [
    ClientComponent,
    ProjectsListComponent
  ],
  exports: [
    ClientComponent
  ]
})

export class ClientModule {}
