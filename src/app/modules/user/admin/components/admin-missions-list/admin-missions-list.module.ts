import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdminMissionsListComponent } from './admin-missions-list.component';
import { MissionService } from '../../../../../services/mission/mission.service';
import { MissionFormModule } from '../../../../sidebars/components/mission-form/mission-form.module';
import {ModalModule, SidebarFullModule, TableModule} from '@umius/umi-common-component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
    MissionFormModule,
    TableModule,
    ModalModule,
    SidebarFullModule,
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
