import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListModule } from '../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { AdminCommunityComponent } from "./admin-community.component";
import { AdminCommunityMembersModule } from "./admin-community-members/admin-community-members.module";
import { AdminCommunityResponsesModule } from "./admin-community-answers/admin-community-responses.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    PipeModule,
    RouterModule,
    AdminCommunityMembersModule,
    AdminCommunityResponsesModule
  ],
  declarations: [
    AdminCommunityComponent
  ],
  exports: [
    AdminCommunityComponent
  ]
})

export class AdminCommunityModule { }
