import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CommunityFormComponent } from './community-form.component';

import { SharedAmbassadorListModule } from "../../../shared/components/shared-ambassador-list/shared-ambassador-list.module";
import { SearchInput3Module } from '../../../utility/search-inputs/search-template-3/search-input-3.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedAmbassadorListModule,
    SearchInput3Module
  ],
  declarations: [
    CommunityFormComponent
  ],
  exports: [
    CommunityFormComponent
  ]
})

export class SidebarCommunityFormModule {}
