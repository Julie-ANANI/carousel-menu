import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';

import { ClientComponent } from './client.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { NewProjectComponent } from './components/new-project/new-project.component';

import { PaginationModule } from '../../utility-components/pagination/pagination.module';
import { ProjectModule } from './components/project/project.module';
import { AccountModule } from './components/account/account.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ClientRoutingModule,
    PaginationModule,
    ReactiveFormsModule,
    ProjectModule,
    AccountModule
  ],
  declarations: [
    ClientComponent,
    ProjectsListComponent,
    NewProjectComponent,
  ],
  exports: [
    ClientComponent
  ]
})

export class ClientModule { }
