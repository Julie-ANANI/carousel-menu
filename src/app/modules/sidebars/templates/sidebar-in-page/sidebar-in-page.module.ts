import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarInPageComponent } from './sidebar-in-page.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    SidebarInPageComponent
  ],
  exports: [
    SidebarInPageComponent
  ]
})

export class SidebarInPageModule {}
