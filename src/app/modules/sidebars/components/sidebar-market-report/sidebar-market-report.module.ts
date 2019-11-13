import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SidebarMarketReportComponent } from './sidebar-market-report.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule
  ],
  declarations: [
   SidebarMarketReportComponent
  ],
  exports: [
    SidebarMarketReportComponent
  ]
})

export class SidebarMarketReportModule {}
