import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

import {SidebarFilterAnswersComponent} from './sidebar-filter-answers.component';
import {PipeModule} from "../../../../pipe/pipe.module";
import {NgxPageScrollModule} from "ngx-page-scroll";
import {SharedWorldListModule} from '../../../shared/components/shared-world-list/shared-world-list.module';
import {InputListModule} from '../../../utility/input-list/input-list.module';
import {AdminProjectDoneModule} from '../../../user/admin/components/admin-project-done-modal/admin-project-done.module';
import {LangEntryPipeModule} from '../../../../pipe/lang-entry/langEntryPipe.module';
import {ModalModule} from '@umius/umi-common-component';
import {MissionPipeModule} from '../../../../pipe/mission/missionPipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    PipeModule,
    NgxPageScrollModule,
    SharedWorldListModule,
    InputListModule,
    AdminProjectDoneModule,
    ModalModule,
    MissionPipeModule,
    LangEntryPipeModule
  ],
  declarations: [
    SidebarFilterAnswersComponent
  ],
  exports: [
    SidebarFilterAnswersComponent
  ]
})

export class SidebarFilterAnswersModule {
}
