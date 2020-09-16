import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {AdminProjectTargetingComponent} from './admin-project-targeting.component';

import {SharedProjectSettingsModule} from '../../../../../shared/components/shared-project-settings-component/shared-project-settings.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedProjectSettingsModule
  ],
  declarations: [
    AdminProjectTargetingComponent,
  ]
})

export class AdminProjectTargetingModule {}
