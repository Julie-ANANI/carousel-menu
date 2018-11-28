import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedFilterInputModule } from '../../../../shared/components/shared-filter-input/shared-filter-input.module';
import { SharedSortModule} from '../../../../shared/components/shared-sort/shared-sort.module';
import { SharedLoaderModule } from '../../../../shared/components/shared-loader/shared-loader.module';
import { SharedPresetModule } from '../../../../shared/components/shared-preset/shared-preset.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { InputModule } from '../../../../input/input.module';
import { AdminPresetsEditComponent } from './admin-presets-edit/admin-presets-edit.component';
import { AdminPresetsListComponent } from './admin-presets-list/admin-presets-list.component';
import { AdminPresetsNewComponent } from './admin-presets-new/admin-presets-new.component';
import { AdminProjectQuestionnaireModule } from '../../admin-project/admin-project-questionnaire/admin-project-questionnaire.module';
import { PaginationModule } from '../../../../utility-components/pagination/pagination.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SharedFilterInputModule,
    SharedSortModule,
    TranslateModule.forChild(),
    InputModule,
    SharedLoaderModule,
    PipeModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminProjectQuestionnaireModule,
    SharedPresetModule,
    PaginationModule
  ],
  declarations: [
    AdminPresetsEditComponent,
    AdminPresetsListComponent,
    AdminPresetsNewComponent
  ]
})

export class AdminPresetsModule {}
