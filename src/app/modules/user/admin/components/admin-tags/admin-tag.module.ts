import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { AdminTagsComponent } from './admin-tags.component';
import { AdminTagListComponent } from './admin-tag-list/admin-tag-list.component';
import { AdminTagNewComponent } from './admin-tag-new/admin-tag-new.component';
import { AdminTagAttachmentsListComponent } from './admin-tag-attachment-list/admin-tag-attachment-list.component';
import { AdminTagAttachmentsSubsetComponent } from './admin-tag-attachment-list/attachment-subset/admin-tag-attachment-subset.component';
import { AdminTagNewModalComponent } from './admin-tag-new/admin-tag-new-modal/admin-tag-new-modal.component';
import { RouterModule } from '@angular/router';
import { AutoCompleteInputModule } from '../../../../utility/auto-complete-input/auto-complete-input.module';
import {AdminTagsRoutingModule} from './admin-tags-routing.module';
import {PaginationModule, SortModule} from '@umius/umi-common-component';
import {LangEntryPipeModule} from '../../../../../pipe/lang-entry/langEntryPipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    PipeModule,
    AutoCompleteInputModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminTagsRoutingModule,
    SortModule,
    PaginationModule,
    AdminTagsRoutingModule,
    LangEntryPipeModule
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
