import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminProjectQuestionnaireComponent } from './admin-project-questionnaire.component';

import { SharedPresetModule } from '../../../../../shared/components/shared-preset/shared-preset.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    TranslateModule.forChild(),
    CommonModule,
    RouterModule,
    SharedPresetModule,
    FormsModule
  ],
  declarations: [
    AdminProjectQuestionnaireComponent,
  ]
})

export class AdminProjectQuestionnaireModule {}
