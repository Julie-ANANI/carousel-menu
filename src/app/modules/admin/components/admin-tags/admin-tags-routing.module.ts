import { Routes } from '@angular/router';

import { AdminTagListComponent } from './admin-tag-list/admin-tag-list.component';


export const tagsRoutes: Routes = [
  { path: '', redirectTo: 'tags', pathMatch: 'full'},
  { path: 'list', component: AdminTagListComponent, pathMatch: 'full' },
];
