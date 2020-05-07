import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {TableModule} from '../../../../table/table.module';
import { AdminMissionsListComponent } from './admin-missions-list.component';
import { MissionService } from '../../../../../services/mission/mission.service';
import { ModalModule } from '../../../../utility/modals/modal/modal.module';
import { SidebarModule } from '../../../../sidebars/templates/sidebar/sidebar.module';
import { MissionFormModule } from '../../../../sidebars/components/mission-form/mission-form.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TableModule,
    TranslateModule.forChild(),
    ModalModule,
    SidebarModule,
    MissionFormModule
  ],
  declarations: [
    AdminMissionsListComponent
  ],
  providers: [
    MissionService
  ],
  exports: [
    AdminMissionsListComponent
  ]
})

export class AdminMissionsListModule { }
