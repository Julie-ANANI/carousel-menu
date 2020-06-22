import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SidebarProjectPitchComponent } from './sidebar-project-pitch.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
import { SharedTextZoneModule } from '../../../shared/components/shared-text-zone/shared-text-zone.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SidebarModule,
    FormsModule,
    SharedTextZoneModule
  ],
  declarations: [
    SidebarProjectPitchComponent
  ],
  exports: [
    SidebarProjectPitchComponent
  ]
})

export class SidebarProjectPitchModule {}
