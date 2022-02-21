import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListModule } from '../../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { AdminCommunityProjectsComponent } from './admin-community-projects.component';
import { AdminCommunityProjectComponent } from './component/admin-community-project/admin-community-project.component';

import { PipeModule } from '../../../../../../pipe/pipe.module';
import { SharedAmbassadorListModule } from '../../../../../shared/components/shared-ambassador-list/shared-ambassador-list.module';
import { SharedWorldmapModule } from '../../../../../shared/components/shared-worldmap/shared-worldmap.module';
import { SidebarCommunityFormModule } from '../../../../../sidebars/components/community-form/sidebar-community-form.module';
import { ErrorTemplate1Module } from '../../../../../utility/errors/error-template-1/error-template-1.module';
import { MessageTemplate2Module } from '../../../../../utility/messages/message-template-2/message-template-2.module';
import {TableModule} from '@umius/umi-common-component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    PipeModule,
    SharedAmbassadorListModule,
    SharedWorldmapModule,
    SidebarCommunityFormModule,
    ErrorTemplate1Module,
    MessageTemplate2Module,
    TableModule,
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
