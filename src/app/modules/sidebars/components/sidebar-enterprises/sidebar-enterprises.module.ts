import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SidebarEnterprisesComponent } from './sidebar-enterprises.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
import { NguiAutoCompleteModule } from '../../../utility/auto-complete/auto-complete.module';
import { ModalModule } from '../../../utility/modals/modal/modal.module';
import { SharedUploadZonePhotoModule } from '../../../shared/components/shared-upload-zone-photo/shared-upload-zone-photo.module';
import { InputListModule } from '../../../utility/input-list/input-list.module';
import {AutoSuggestionModule} from '../../../utility/auto-suggestion/auto-suggestion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    NguiAutoCompleteModule,
    ModalModule,
    SharedUploadZonePhotoModule,
    InputListModule,
    AutoSuggestionModule,
  ],
  declarations: [
    SidebarEnterprisesComponent
  ],
  exports: [
    SidebarEnterprisesComponent
  ]
})

export class SidebarEnterprisesModule {}
