import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminPresetsEditComponent } from './admin-presets-edit/admin-presets-edit.component';
import { AdminPresetsListComponent } from './admin-presets-list/admin-presets-list.component';

import { SharedPresetModule } from '../../../../../shared/components/shared-preset/shared-preset.module';
import { AdminProjectQuestionnaireModule } from '../../admin-project/admin-project-questionnaire/admin-project-questionnaire.module';
import { ModalModule } from '../../../../../utility/modals/modal/modal.module';
import { MessageErrorModule } from "../../../../../utility/messages/message-error/message-error.module";
import { MessageTemplateModule } from "../../../../../utility/messages/message-template/message-template.module";
import { TableComponentsModule } from '@umius/umi-common-component/table';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule,
        AdminProjectQuestionnaireModule,
        SharedPresetModule,
        ModalModule,

        FormsModule,
        MessageErrorModule,
        MessageTemplateModule,
        TableComponentsModule
    ],
  declarations: [
    AdminPresetsEditComponent,
    AdminPresetsListComponent
  ]
})

export class AdminPresetsModule {}
