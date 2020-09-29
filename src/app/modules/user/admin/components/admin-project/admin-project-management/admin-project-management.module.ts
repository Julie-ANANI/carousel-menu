import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AdminProjectManagementComponent} from './admin-project-management.component';

import {SidebarModule} from '../../../../../sidebars/templates/sidebar/sidebar.module';
import {SidebarInnovationFormModule} from '../../../../../sidebars/components/innovation-form/sidebar-innovation-form.module';
import {SidebarBlacklistModule} from '../../../../../sidebars/components/sidebar-blacklist/sidebar-blacklist.module';
import {SidebarTagsModule} from '../../../../../sidebars/components/sidebar-tags/sidebar-tags.module';
import {MissionFormModule} from '../../../../../sidebars/components/mission-form/mission-form.module';
import {SharedTagsModule} from '../../../../../shared/components/shared-tags/shared-tags.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    SidebarInnovationFormModule,
    SidebarBlacklistModule,
    SidebarTagsModule,
    MissionFormModule,
    SharedTagsModule,
  ],
  declarations: [
    AdminProjectManagementComponent,
  ]
})

export class AdminProjectManagementModule {}
