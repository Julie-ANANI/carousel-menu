import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSortModule} from '../../../../shared/components/shared-sort/shared-sort.module';
import { SharedPaginationModule } from '../../../../shared/components/shared-pagination/shared-pagination.module';
import { SharedFilterInputModule } from '../../../../shared/components/shared-filter-input/filter-input.module';
import { SharedLoaderModule } from '../../../../shared/components/shared-loader/shared-loader.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { AdminQuestionsComponent } from './admin-questions.component';
import { AdminQuestionsEditComponent } from './admin-questions-edit/admin-questions-edit.component';
import { AdminQuestionsListComponent } from './admin-questions-list/admin-questions-list.component';
import { AdminQuestionsNewComponent } from './admin-questions-new/admin-questions-new.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedSortModule,
    SharedPaginationModule,
    SharedFilterInputModule,
    TranslateModule.forChild(),
    SharedLoaderModule,
    PipeModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminQuestionsComponent,
    AdminQuestionsEditComponent,
    AdminQuestionsListComponent,
    AdminQuestionsNewComponent
  ],
  exports: [
    AdminQuestionsComponent
  ]
})

export class AdminQuestionsModule {}
