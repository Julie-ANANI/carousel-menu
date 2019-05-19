import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminCommunityComponent } from "./admin-community.component";

import { CommunityProjectsResolver } from './services/community-projects-resolver';
import { TagsSectorResolver } from '../../../../../resolvers/tags-sector-resolver';

import { SharedProsListModule } from '../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { AdminCommunityMembersModule } from "./admin-community-members/admin-community-members.module";
import { AdminCommunityResponsesModule } from "./admin-community-answers/admin-community-responses.module";
import { AdminCommunityProjectsModule } from "./admin-community-projects/admin-community-projects.module";
import { SharedAmbassadorListModule } from "../../../../shared/components/shared-ambassador-list/shared-ambassador-list.module";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    SharedAmbassadorListModule,
    TranslateModule.forChild(),
    PipeModule,
    RouterModule,
    AdminCommunityMembersModule,
    AdminCommunityResponsesModule,
    AdminCommunityProjectsModule
  ],
  providers: [
    CommunityProjectsResolver,
    TagsSectorResolver
  ],
  declarations: [
    AdminCommunityComponent
  ],
  exports: [
    AdminCommunityComponent
  ]
})

export class AdminCommunityModule { }
