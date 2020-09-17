import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import {AdminProjectSettingsComponent} from './admin-project-settings.component';

import {AdminStatsBannerModule} from '../../admin-stats-banner/admin-stats-banner.module';

@NgModule({
  imports: [
    CommonModule,
    AdminStatsBannerModule,
    FormsModule
  ],
  declarations: [
    AdminProjectSettingsComponent
  ],
  exports: [
    AdminProjectSettingsComponent
  ]
})

export class AdminProjectSettingsModule { }
