import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarSearchToolComponent } from './sidebar-search-tool.component';

import { SidebarModule } from '../../sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarModule
  ],
  declarations: [
   SidebarSearchToolComponent
  ],
  exports: [
    SidebarSearchToolComponent
  ]
})

export class SidebarSearchToolModule {}
