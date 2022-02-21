import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminProjectTagsPoolComponent} from './admin-project-tags-pool.component';
import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {SidebarTagsModule} from '../../../../../sidebars/components/sidebar-tags/sidebar-tags.module';
import {SidebarFullModule, TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    MessageErrorModule,
    SidebarTagsModule,
    TableModule,
    SidebarFullModule
  ],
  declarations: [
    AdminProjectTagsPoolComponent
  ]
})

export class AdminProjectTagsPoolModule {}
