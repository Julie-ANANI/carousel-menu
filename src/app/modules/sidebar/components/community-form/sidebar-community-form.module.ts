import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CommunityFormComponent } from './community-form.component';

import { SidebarModule } from '../../sidebar.module';
import {SharedAmbassadorListModule} from "../../../shared/components/shared-ambassador-list/shared-ambassador-list.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    SharedAmbassadorListModule,
  ],
  declarations: [
    CommunityFormComponent
  ],
  exports: [
    CommunityFormComponent
  ]
})

export class SidebarCommunityFormModule {}
