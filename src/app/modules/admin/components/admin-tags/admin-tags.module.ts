/**
 * Created by juandavidcruzgomez on 20/03/2018.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MultilingModule } from '../../../../pipes/multiling/multiling.module';
import { SharedModule } from '../../../shared/shared.module';
import { SharedSortModule } from '../../../shared/components/shared-sort/sort.module';
import { SharedPaginationModule } from '../../../shared/components/shared-pagination/pagination.module';
import { GlobalModule } from "../../../global/global.module";

import { AdminTagsComponent } from './admin-tags.component';
import { AdminTagListComponent } from './admin-tag-list/admin-tag-list.component';
import { AdminTagNewComponent } from './admin-tag-new/admin-tag-new.component';
import { AdminTagAttachmentsListComponent } from './admin-tag-attachment-list/admin-tag-attachment-list.component';
import { AdminTagAttachmentsSubsetComponent } from './admin-tag-attachment-list/attachment-subset/admin-tag-attachment-subset.component';
import { AdminTagNewModalComponent } from './admin-tag-new/admin-tag-new-modal/admin-tag-new-modal.component';
import {AutocompleteInputModule} from '../../../../directives/autocomplete-input/autocomplete-input.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedSortModule,
    SharedPaginationModule,
    MultilingModule,
    SharedModule,
    TranslateModule.forChild(),
    AutocompleteInputModule
    GlobalModule,
    TranslateModule.forChild()
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

export class AdminTagsModule {}
