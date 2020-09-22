import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminProjectCollectionComponent} from './admin-project-collection.component';

import {AdminStatsBannerModule} from '../../admin-stats-banner/admin-stats-banner.module';
import {TableModule} from '../../../../../table/table.module';
import {SidebarModule} from '../../../../../sidebars/templates/sidebar/sidebar.module';
import {SidebarUserAnswerModule} from '../../../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module';

@NgModule({
  imports: [
    CommonModule,
    AdminStatsBannerModule,
    TableModule,
    SidebarModule,
    SidebarUserAnswerModule,
  ],
  declarations: [
    AdminProjectCollectionComponent
  ],
  exports: [
    AdminProjectCollectionComponent
  ]
})

export class AdminProjectCollectionModule { }
