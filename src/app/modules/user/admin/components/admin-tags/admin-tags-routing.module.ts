import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AdminTagListComponent } from './admin-tag-list/admin-tag-list.component';
import { AdminTagAttachmentsListComponent } from './admin-tag-attachment-list/admin-tag-attachment-list.component';
import { AdminTagsComponent } from './admin-tags.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminTagsComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full'},
      { path: 'list', component: AdminTagListComponent, pathMatch: 'full' },
      { path: 'attachments', component: AdminTagAttachmentsListComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminTagsRoutingModule {}
