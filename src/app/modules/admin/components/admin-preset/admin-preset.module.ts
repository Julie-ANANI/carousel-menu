// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdminPresetsModule } from './admin-presets/admin-presets.module';
import { AdminQuestionsModule } from './admin-questions/admin-questions.module';
import { AdminSectionsModule } from './admin-sections/admin-sections.module';
import { PipeModule } from '../../../../pipe/pipe.module';

// Components
import { AdminPresetComponent } from './admin-preset.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminPresetsModule,
    AdminQuestionsModule,
    RouterModule,
    AdminSectionsModule,
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
