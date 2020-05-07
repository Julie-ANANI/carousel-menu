import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminProjectQuestionnaireComponent } from './admin-project-questionnaire.component';

import { SharedPresetModule } from '../../../../../shared/components/shared-preset/shared-preset.module';
import { ModalModule } from '../../../../../utility/modals/modal/modal.module';
import { NguiAutoCompleteModule } from '../../../../../utility/auto-complete/auto-complete.module';

@NgModule({
  imports: [
    TranslateModule.forChild(),
    CommonModule,
    RouterModule,
    SharedPresetModule,
    FormsModule,
    ModalModule,
    NguiAutoCompleteModule
  ],
  declarations: [
    AdminProjectQuestionnaireComponent,
  ]
})

export class AdminProjectQuestionnaireModule {}
