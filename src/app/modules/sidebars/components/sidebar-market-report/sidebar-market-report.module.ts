import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SidebarMarketReportComponent } from './sidebar-market-report.component';
import {PipeModule} from "../../../../pipe/pipe.module";
import {NgxPageScrollModule} from "ngx-page-scroll";
import {ModalModule} from "../../../utility-components/modals/modal/modal.module";
import {ExportModalComponent} from "./export-modal/export-modal.component";


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    PipeModule,
    NgxPageScrollModule,
    ModalModule
  ],
  declarations: [
    SidebarMarketReportComponent,
    ExportModalComponent
  ],
  exports: [
    SidebarMarketReportComponent
  ]
})

export class SidebarMarketReportModule {}
