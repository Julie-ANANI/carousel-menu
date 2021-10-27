import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarSearchToolComponent } from './sidebar-search-tool.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
import { TableComponentsModule } from '@umius/umi-common-component/table';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        SidebarModule,
        TableComponentsModule
    ],
  declarations: [
   SidebarSearchToolComponent
  ],
  exports: [
    SidebarSearchToolComponent
  ]
})

export class SidebarSearchToolModule {}
