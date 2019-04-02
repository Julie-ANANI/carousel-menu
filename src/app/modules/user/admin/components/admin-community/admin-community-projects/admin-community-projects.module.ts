import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListModule } from '../../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { PipeModule } from '../../../../../../pipe/pipe.module';
import { AdminCommunityProjectsComponent } from "./admin-community-projects.component";
import { SidebarModule } from "../../../../../sidebar/sidebar.module";
import { TableModule } from "../../../../../table/table.module";
import { AdminCommunityProjectComponent } from "./component/admin-community-project/admin-community-project.component";
import { SharedAmbassadorListModule } from "../../../../../shared/components/shared-ambassador-list/shared-ambassador-list.module";
import { SharedWorldmapModule } from "../../../../../shared/components/shared-worldmap/shared-worldmap.module";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    PipeModule,
    SidebarModule,
    TableModule,
    SharedAmbassadorListModule,
    SharedWorldmapModule
  ],
  declarations: [
    AdminCommunityProjectsComponent,
    AdminCommunityProjectComponent
  ],
  exports: [
    AdminCommunityProjectsComponent
  ]
})

export class AdminCommunityProjectsModule { }
