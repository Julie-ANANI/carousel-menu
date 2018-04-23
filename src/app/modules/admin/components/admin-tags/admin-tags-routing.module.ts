import { Routes } from '@angular/router';

import { AdminTagListComponent } from './admin-tag-list/admin-tag-list.component';
import { AdminTagAttachmentsListComponent } from './admin-tag-attachment-list/admin-tag-attachment-list.component';


export const tagsRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'list', component: AdminTagListComponent, pathMatch: 'full' },
  { path: 'attachments', component: AdminTagAttachmentsListComponent, pathMatch: 'full' }
];
