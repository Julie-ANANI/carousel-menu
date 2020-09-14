import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminProjectSettingsComponent} from './admin-project-settings.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AdminProjectSettingsComponent
  ],
  exports: [
    AdminProjectSettingsComponent
  ]
})

export class AdminProjectSettingsModule { }
