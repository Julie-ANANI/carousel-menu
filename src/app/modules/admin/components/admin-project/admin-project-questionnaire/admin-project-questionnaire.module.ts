import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedPresetModule } from '../../../../shared/components/shared-preset/shared-preset.module';
import { AdminProjectQuestionnaireComponent } from './admin-project-questionnaire.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedPresetModule
  ],
  declarations: [
    AdminProjectQuestionnaireComponent,
  ]
})

export class AdminProjectQuestionnaireModule {}
