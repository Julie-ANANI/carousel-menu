import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SidebarFilterAnswersComponent } from './sidebar-filter-answers.component';
import {PipeModule} from "../../../../pipe/pipe.module";
import {NgxPageScrollModule} from "ngx-page-scroll";
import {ModalModule} from "../../../utility/modals/modal/modal.module";
import {SharedWorldListModule} from '../../../shared/components/shared-world-list/shared-world-list.module';
import {InputListModule} from '../../../utility/input-list/input-list.module';
import {AdminProjectDoneModule} from '../../../user/admin/components/admin-project-done-modal/admin-project-done.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        FormsModule,
        PipeModule,
        NgxPageScrollModule,
        ModalModule,
        SharedWorldListModule,
        InputListModule,
        AdminProjectDoneModule
    ],
  declarations: [
    SidebarFilterAnswersComponent
  ],
  exports: [
    SidebarFilterAnswersComponent
  ]
})

export class SidebarFilterAnswersModule {}
