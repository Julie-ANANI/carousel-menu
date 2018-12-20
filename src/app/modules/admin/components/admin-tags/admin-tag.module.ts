import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSortModule } from '../../../shared/components/shared-sort/shared-sort.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { AdminTagsComponent } from './admin-tags.component';
import { AdminTagListComponent } from './admin-tag-list/admin-tag-list.component';
import { AdminTagNewComponent } from './admin-tag-new/admin-tag-new.component';
import { AdminTagAttachmentsListComponent } from './admin-tag-attachment-list/admin-tag-attachment-list.component';
import { AdminTagAttachmentsSubsetComponent } from './admin-tag-attachment-list/attachment-subset/admin-tag-attachment-subset.component';
import { AdminTagNewModalComponent } from './admin-tag-new/admin-tag-new-modal/admin-tag-new-modal.component';
import { RouterModule } from '@angular/router';
import { AutocompleteInputModule } from '../../../utility-components/autocomplete-input/autocomplete-input.module';
import { PaginationModule } from '../../../utility-components/pagination/pagination.module';

@NgModule({
  imports: [
    CommonModule,
    SharedSortModule,
    TranslateModule.forChild(),
    PipeModule,
    AutocompleteInputModule,
    PaginationModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminTagsComponent,
    AdminTagListComponent,
    AdminTagNewComponent,
    AdminTagAttachmentsListComponent,
    AdminTagAttachmentsSubsetComponent,
    AdminTagNewModalComponent
  ],
  exports: [
    AdminTagsComponent
  ]
})

export class AdminTagModule {}
