import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SidebarEnterprisesComponent } from './sidebar-enterprises.component';

import { NguiAutoCompleteModule } from '../../../utility/auto-complete/auto-complete.module';
import { SharedUploadZonePhotoModule } from '../../../shared/components/shared-upload-zone-photo/shared-upload-zone-photo.module';
import { InputListModule } from '../../../utility/input-list/input-list.module';
import {TranslateModule} from '@ngx-translate/core';
import {AutoSuggestionModule, ModalModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    SharedUploadZonePhotoModule,
    InputListModule,
    TranslateModule,
    AutoSuggestionModule,
    ModalModule,
  ],
  declarations: [
    SidebarEnterprisesComponent
  ],
  exports: [
    SidebarEnterprisesComponent
  ]
})

export class SidebarEnterprisesModule {}
