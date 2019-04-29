import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedFilterInputModule } from '../../../../../shared/components/shared-filter-input/shared-filter-input.module';
import { SharedSortModule} from '../../../../../shared/components/shared-sort/shared-sort.module';
import { SharedLoaderModule } from '../../../../../shared/components/shared-loader/shared-loader.module';
import { SharedPresetModule } from '../../../../../shared/components/shared-preset/shared-preset.module';
import { PipeModule } from '../../../../../../pipe/pipe.module';
import { AdminPresetsEditComponent } from './admin-presets-edit/admin-presets-edit.component';
import { AdminPresetsListComponent } from './admin-presets-list/admin-presets-list.component';
import { AdminPresetsNewComponent } from './admin-presets-new/admin-presets-new.component';
import { AdminProjectQuestionnaireModule } from '../../admin-project/admin-project-questionnaire/admin-project-questionnaire.module';
import { PaginationTemplate1Module } from '../../../../../utility-components/paginations/pagination-template-1/pagination-template-1.module';
import { ModalModule } from '../../../../../utility-components/modals/modal/modal.module';

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
    PaginationTemplate1Module,
    ModalModule,
  ],
  declarations: [
    AdminPresetsEditComponent,
    AdminPresetsListComponent,
    AdminPresetsNewComponent
  ]
})

export class AdminPresetsModule {}
