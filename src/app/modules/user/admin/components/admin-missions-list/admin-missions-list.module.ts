import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {TableModule} from '../../../../table/table.module';
import { AdminMissionsListComponent } from './admin-missions-list.component';
import { MissionService } from '../../../../../services/mission/mission.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    TranslateModule.forChild()
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
