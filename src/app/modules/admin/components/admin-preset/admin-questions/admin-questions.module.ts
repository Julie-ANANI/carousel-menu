import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminQuestionsComponent } from './admin-questions.component';
import { AdminQuestionsEditComponent } from './admin-questions-edit/admin-questions-edit.component';
import { AdminQuestionsListComponent } from './admin-questions-list/admin-questions-list.component';
import { AdminQuestionsNewComponent } from './admin-questions-new/admin-questions-new.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild()
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
