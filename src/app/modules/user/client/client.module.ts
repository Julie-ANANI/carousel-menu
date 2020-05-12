import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';

import { ClientComponent } from './client.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { ExecutiveReportComponent } from './components/print/executive-report/executive-report.component';

import { PaginationTemplate1Module } from '../../utility/paginations/pagination-template-1/pagination-template-1.module';
import { ProjectModule } from './components/project/project.module';
import { AccountModule } from './components/account/account.module';
import { SynthesisListModule } from './components/synthesis-list/synthesis-list.module';
import { SynthesisCompleteModule } from '../../public/share/component/synthesis-complete/synthesis-complete.module';
import { MessageTemplate1Module } from '../../utility/messages/message-template-1/message-template-1.module';
import { TagsService } from "../../../services/tags/tags.service";
import { ModalModule } from '../../utility/modals/modal/modal.module';
import { PaginationTemplate2Module } from '../../utility/paginations/pagination-template-2/pagination-template-2.module';
import { NewProjectModule } from './components/new-project/new-project.module';
import {SharedExecutiveReportModule} from '../../shared/components/shared-executive-report/shared-executive-report.module';

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
    MessageTemplate1Module,
    ModalModule,
    PaginationTemplate2Module,
    NewProjectModule,
    SharedExecutiveReportModule
  ],
  providers: [
    TagsService
  ],
  declarations: [
    ClientComponent,
    ProjectsListComponent,
    ExecutiveReportComponent
  ],
  exports: [
    ClientComponent
  ]
})

export class ClientModule { }
