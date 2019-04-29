import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';

import { ClientComponent } from './client.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { NewProjectComponent } from './components/new-project/new-project.component';

import { PaginationTemplate1Module } from '../../utility-components/paginations/pagination-template-1/pagination-template-1.module';
import { ProjectModule } from './components/project/project.module';
import { AccountModule } from './components/account/account.module';
import { SynthesisListModule } from './components/synthesis-list/synthesis-list.module';
import { SynthesisCompleteModule } from '../../public/share/component/synthesis-complete/synthesis-complete.module';
import { MessageSpaceModule } from '../../utility-components/message-space/message-space.module';
import { TagsService } from "../../../services/tags/tags.service";
import { ModalModule } from '../../utility-components/modals/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ClientRoutingModule,
    PaginationTemplate1Module,
    ReactiveFormsModule,
    ProjectModule,
    AccountModule,
    SynthesisListModule,
    SynthesisCompleteModule,
    MessageSpaceModule,
    ModalModule
  ],
  providers: [
    TagsService
  ],
  declarations: [
    ClientComponent,
    ProjectsListComponent,
    NewProjectComponent
  ],
  exports: [
    ClientComponent
  ]
})

export class ClientModule { }
