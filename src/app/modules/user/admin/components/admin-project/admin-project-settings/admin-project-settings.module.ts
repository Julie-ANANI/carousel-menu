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
  ],
  declarations: [
    AdminProjectSettingsComponent
  ],
  exports: [
    AdminProjectSettingsComponent
  ]
})

export class AdminProjectSettingsModule { }
