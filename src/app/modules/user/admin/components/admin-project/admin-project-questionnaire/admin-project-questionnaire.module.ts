import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminProjectQuestionnaireComponent } from './admin-project-questionnaire.component';

import { SharedPresetModule } from '../../../../../shared/components/shared-preset/shared-preset.module';
import { NguiAutoCompleteModule } from '../../../../../utility/auto-complete/auto-complete.module';
import {SharedQuestionnaireModule} from '../../../../../shared/components/shared-questionnaire/shared-questionnaire.module';
import {ModalModule} from '@umius/umi-common-component';
import { SharedQuestionnaireMirrorViewModule } from "../../../../../shared/components/shared-questionnaire-mirror-view/shared-questionnaire-mirror-view.module";

@NgModule({
    imports: [
        TranslateModule.forChild(),
        CommonModule,
        RouterModule,
        SharedPresetModule,
        FormsModule,
        NguiAutoCompleteModule,
        SharedQuestionnaireModule,
        ModalModule,
        SharedQuestionnaireMirrorViewModule
    ],
  declarations: [
    AdminProjectQuestionnaireComponent,
  ]
})

export class AdminProjectQuestionnaireModule {}
