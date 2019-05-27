import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminCommunityMembersComponent } from "./admin-community-members.component";
import { AdminCommunityMemberComponent } from './components/admin-community-member/admin-community-member.component';

import { SidebarAdvsearchFormModule } from "../../../../../sidebar/components/advsearch-form/sidebar-advsearch-form.module";
import { SidebarModule } from "../../../../../sidebar/sidebar.module";
import { SidebarAddAmbassadorFormModule } from "../../../../../sidebar/components/add-ambassador-form/sidebar-add-ambassador-form.module";
import { SharedAmbassadorListModule } from "../../../../../shared/components/shared-ambassador-list/shared-ambassador-list.module";
import { PipeModule } from '../../../../../../pipe/pipe.module';
import { TableModule } from '../../../../../table/table.module';
import { SidebarCommunityFormModule } from '../../../../../sidebar/components/community-form/sidebar-community-form.module';
import { ErrorTemplate1Module } from '../../../../../utility-components/errors/error-template-1/error-template-1.module';
import { NguiAutoCompleteModule } from '../../../../../utility-components/auto-complete/auto-complete.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedAmbassadorListModule,
    TranslateModule.forChild(),
    PipeModule,
    SidebarModule,
    SidebarAdvsearchFormModule,
    SidebarAddAmbassadorFormModule,
    TableModule,
    SidebarCommunityFormModule,
    ErrorTemplate1Module,
    NguiAutoCompleteModule
  ],
  declarations: [
    AdminCommunityMembersComponent,
    AdminCommunityMemberComponent,
  ],
  exports: [
    AdminCommunityMembersComponent
  ]
})

export class AdminCommunityMembersModule { }
