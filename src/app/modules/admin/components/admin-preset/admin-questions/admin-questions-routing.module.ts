import { Routes } from '@angular/router';

import { AdminQuestionsComponent } from './admin-questions.component';
import { AdminQuestionsEditComponent } from './admin-questions-edit/admin-questions-edit.component';
import { AdminQuestionsListComponent } from './admin-questions-list/admin-questions-list.component';
import { AdminQuestionsNewComponent } from './admin-questions-new/admin-questions-new.component';

export const questionsRoutes: Routes = [
  {
    path: '',
    component: AdminQuestionsComponent,
    children: [
      { path: '', component: AdminQuestionsListComponent, pathMatch: 'full' },
      { path: 'new', component: AdminQuestionsNewComponent, pathMatch: 'full' },
      { path: ':questionId', component: AdminQuestionsEditComponent, pathMatch: 'full' }
    ]
  }
];
