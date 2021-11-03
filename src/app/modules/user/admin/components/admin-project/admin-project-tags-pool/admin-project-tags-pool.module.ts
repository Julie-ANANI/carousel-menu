import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminProjectTagsPoolComponent} from './admin-project-tags-pool.component';
import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {TableComponentsModule} from '@umius/umi-common-component/table';
import {SidebarModule} from '../../../../../sidebars/templates/sidebar/sidebar.module';
import {SidebarTagsModule} from '../../../../../sidebars/components/sidebar-tags/sidebar-tags.module';

@NgModule({
  imports: [
    CommonModule,
    MessageErrorModule,
    TableComponentsModule,
    SidebarModule,
    SidebarTagsModule
  ],
  declarations: [
    AdminProjectTagsPoolComponent
  ]
})

export class AdminProjectTagsPoolModule {}
