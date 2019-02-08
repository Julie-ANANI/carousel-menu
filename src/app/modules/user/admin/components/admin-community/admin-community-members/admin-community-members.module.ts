import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListModule } from '../../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { PipeModule } from '../../../../../../pipe/pipe.module';
import { AdminCommunityMembersComponent } from "./admin-community-members.component";
import { SidebarAdvsearchFormModule } from "../../../../../sidebar/components/advsearch-form/sidebar-advsearch-form.module";
import { SidebarModule } from "../../../../../sidebar/sidebar.module";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    PipeModule,
    SidebarModule,
    SidebarAdvsearchFormModule
  ],
  declarations: [
    AdminCommunityMembersComponent
  ],
  exports: [
    AdminCommunityMembersComponent
  ]
})

export class AdminCommunityMembersModule { }
