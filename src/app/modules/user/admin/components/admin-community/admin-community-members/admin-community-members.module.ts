import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { PipeModule } from '../../../../../../pipe/pipe.module';
import { AdminCommunityMembersComponent } from "./admin-community-members.component";
import { SidebarAdvsearchFormModule } from "../../../../../sidebar/components/advsearch-form/sidebar-advsearch-form.module";
import { SidebarModule } from "../../../../../sidebar/sidebar.module";
import { SidebarAddAmbassadorFormModule } from "../../../../../sidebar/components/add-ambassador-form/sidebar-add-ambassador-form.module";
import { SharedAmbassadorListModule } from "../../../../../shared/components/shared-ambassador-list/shared-ambassador-list.module";
import { MemberComponent } from './components/member/member.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedAmbassadorListModule,
    TranslateModule.forChild(),
    PipeModule,
    SidebarModule,
    SidebarAdvsearchFormModule,
    SidebarAddAmbassadorFormModule
  ],
  declarations: [
    AdminCommunityMembersComponent,
    MemberComponent
  ],
  exports: [
    AdminCommunityMembersComponent
  ]
})

export class AdminCommunityMembersModule { }
