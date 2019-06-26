import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListModule } from '../../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { AdminCommunityProjectsComponent } from "./admin-community-projects.component";
import { AdminCommunityProjectComponent } from "./component/admin-community-project/admin-community-project.component";

import { PipeModule } from '../../../../../../pipe/pipe.module';
import { SidebarModule } from "../../../../../sidebar/sidebar.module";
import { TableModule } from "../../../../../table/table.module";
import { SharedAmbassadorListModule } from "../../../../../shared/components/shared-ambassador-list/shared-ambassador-list.module";
import { SharedWorldmapModule } from "../../../../../shared/components/shared-worldmap/shared-worldmap.module";
import { SidebarCommunityFormModule } from "../../../../../sidebar/components/community-form/sidebar-community-form.module";
import { MessageSpaceModule } from '../../../../../utility-components/messages/message-template-1/message-space.module';
import { ErrorTemplate1Module } from '../../../../../utility-components/errors/error-template-1/error-template-1.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    PipeModule,
    SidebarModule,
    TableModule,
    SharedAmbassadorListModule,
    SharedWorldmapModule,
    SidebarCommunityFormModule,
    MessageSpaceModule,
    ErrorTemplate1Module
  ],
  declarations: [
    AdminCommunityProjectsComponent,
    AdminCommunityProjectComponent
  ],
  exports: [
    AdminCommunityProjectsComponent
  ]
})

export class AdminCommunityProjectsModule { }
