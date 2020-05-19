import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SidebarFilterAnswersComponent } from './sidebar-filter-answers.component';
import {PipeModule} from "../../../../pipe/pipe.module";
import {NgxPageScrollModule} from "ngx-page-scroll";
import {ModalModule} from "../../../utility/modals/modal/modal.module";

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
    SidebarFilterAnswersComponent
  ],
  exports: [
    SidebarFilterAnswersComponent
  ]
})

export class SidebarFilterAnswersModule {}
