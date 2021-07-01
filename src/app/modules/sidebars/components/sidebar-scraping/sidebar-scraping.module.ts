import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarScrapingComponent } from './sidebar-scraping.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SidebarScrapingComponent,
  ],
  exports: [
    SidebarScrapingComponent,
  ]
})

export class SidebarScrapingModule {}
