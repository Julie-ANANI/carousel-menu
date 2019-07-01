import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminPresetsEditComponent } from './admin-presets-edit/admin-presets-edit.component';
import { AdminPresetsListComponent } from './admin-presets-list/admin-presets-list.component';

import { SharedFilterInputModule } from '../../../../../shared/components/shared-filter-input/shared-filter-input.module';
import { SharedSortModule} from '../../../../../shared/components/shared-sort/shared-sort.module';
import { SharedLoaderModule } from '../../../../../shared/components/shared-loader/shared-loader.module';
import { SharedPresetModule } from '../../../../../shared/components/shared-preset/shared-preset.module';
import { PipeModule } from '../../../../../../pipe/pipe.module';
import { AdminProjectQuestionnaireModule } from '../../admin-project/admin-project-questionnaire/admin-project-questionnaire.module';
import { ModalModule } from '../../../../../utility-components/modals/modal/modal.module';
import { ErrorTemplate1Module } from '../../../../../utility-components/errors/error-template-1/error-template-1.module';
import { MessageTemplate2Module } from '../../../../../utility-components/messages/message-template-2/message-template-2.module';
import { TableModule } from '../../../../../table/table.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SharedFilterInputModule,
    SharedSortModule,
    TranslateModule.forChild(),
    SharedLoaderModule,
    PipeModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminProjectQuestionnaireModule,
    SharedPresetModule,
    ModalModule,
    ErrorTemplate1Module,
    MessageTemplate2Module,
    TableModule
  ],
  declarations: [
    AdminPresetsEditComponent,
    AdminPresetsListComponent
  ]
})

export class AdminPresetsModule {}
