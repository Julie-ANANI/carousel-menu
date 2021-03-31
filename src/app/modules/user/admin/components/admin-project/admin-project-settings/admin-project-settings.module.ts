import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import {AdminProjectSettingsComponent} from './admin-project-settings.component';

import {AdminStatsBannerModule} from '../../admin-stats-banner/admin-stats-banner.module';
import {SidebarModule} from '../../../../../sidebars/templates/sidebar/sidebar.module';
import {SidebarTagsModule} from '../../../../../sidebars/components/sidebar-tags/sidebar-tags.module';
import {MissionFormModule} from '../../../../../sidebars/components/mission-form/mission-form.module';
import {SidebarBlacklistModule} from '../../../../../sidebars/components/sidebar-blacklist/sidebar-blacklist.module';
import {AutoSuggestionModule} from '../../../../../utility/auto-suggestion/auto-suggestion.module';
import {ModalModule} from '../../../../../utility/modals/modal/modal.module';
import {TextInputModule} from '../../../../../utility/text-input/text-input.module';
import { AdminProjectSettingsModalComponent } from './admin-project-settings-modal/admin-project-settings-modal.component';
import {SharedUploadZonePhotoModule} from '../../../../../shared/components/shared-upload-zone-photo/shared-upload-zone-photo.module';

@NgModule({
  imports: [
    CommonModule,
    AdminStatsBannerModule,
    FormsModule,
    SidebarModule,
    SidebarTagsModule,
    MissionFormModule,
    SidebarBlacklistModule,
    AutoSuggestionModule,
    ModalModule,
    TextInputModule,
    SharedUploadZonePhotoModule
  ],
  declarations: [
    AdminProjectSettingsComponent,
    AdminProjectSettingsModalComponent
  ],
  exports: [
    AdminProjectSettingsComponent
  ]
})

export class AdminProjectSettingsModule { }
