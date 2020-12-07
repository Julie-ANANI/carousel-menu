import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {AdminProjectDescriptionComponent} from './admin-project-description.component';
import {FormsModule} from '@angular/forms';
import {SharedEditorTinymceModule} from '../../../../../shared/components/shared-editor-tinymce/shared-editor-tinymce.module';
import {ModalEmptyModule} from '../../../../../utility/modals/modal-empty/modal-empty.module';
import {SharedUploadZonePhotoModule} from '../../../../../shared/components/shared-upload-zone-photo/shared-upload-zone-photo.module';
import {SharedUploadZoneVideoModule} from '../../../../../shared/components/shared-upload-zone-video/shared-upload-zone-video.module';
import {CommentListModule} from '../../../../../sidebars/components/comment-list/comment-list.module';
import {SharedEditorsModule} from '../../../../../shared/components/shared-editors/shared-editors.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedEditorTinymceModule,
    ModalEmptyModule,
    SharedUploadZonePhotoModule,
    SharedUploadZoneVideoModule,
    SharedEditorsModule,
    CommentListModule
  ],
  declarations: [
    AdminProjectDescriptionComponent,
  ]
})

export class AdminProjectDescriptionModule {}
