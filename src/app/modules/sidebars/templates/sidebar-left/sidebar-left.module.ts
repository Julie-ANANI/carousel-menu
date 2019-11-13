import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarLeftComponent } from './sidebar-left.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    SidebarLeftComponent,
  ],
  exports: [
    SidebarLeftComponent,
  ]
})

export class SidebarLeftModule {}
