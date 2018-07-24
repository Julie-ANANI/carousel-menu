import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdminPresetsModule } from './admin-presets/admin-presets.module';

import { PipeModule } from '../../../../pipe/pipe.module';
import { AdminPresetComponent } from './admin-preset.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminPresetsModule,
    RouterModule,
    TranslateModule.forChild(),
    PipeModule
  ],
  declarations: [
    AdminPresetComponent
  ],
  exports: [
    AdminPresetComponent
  ]
})

export class AdminPresetModule { }
