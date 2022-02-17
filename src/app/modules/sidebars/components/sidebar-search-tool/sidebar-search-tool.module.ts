import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarSearchToolComponent } from './sidebar-search-tool.component';
import {TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    TableModule
  ],
  declarations: [
   SidebarSearchToolComponent
  ],
  exports: [
    SidebarSearchToolComponent
  ]
})

export class SidebarSearchToolModule {}
