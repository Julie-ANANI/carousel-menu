import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {AdminProjectDescriptionComponent} from './admin-project-description.component';
import {FormsModule} from '@angular/forms';
import {SharedEditorTinymceModule} from '../../../../../shared/components/shared-editor-tinymce/shared-editor-tinymce.module';
import {SharedUploadZonePhotoModule} from '../../../../../shared/components/shared-upload-zone-photo/shared-upload-zone-photo.module';
import {SharedUploadZoneVideoModule} from '../../../../../shared/components/shared-upload-zone-video/shared-upload-zone-video.module';
import {CommentListModule} from '../../../../../sidebars/components/comment-list/comment-list.module';
import {SharedEditorsModule} from '../../../../../shared/components/shared-editors/shared-editors.module';
import { CleanHtmlModule } from '../../../../../../pipe/cleanHtml/cleanHtml.module';
import {PipeModule} from '../../../../../../pipe/pipe.module';
import { NgxPageScrollModule } from "ngx-page-scroll";
import {ModalModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedEditorTinymceModule,
    SharedUploadZonePhotoModule,
    SharedUploadZoneVideoModule,
    SharedEditorsModule,
    CommentListModule,
    CleanHtmlModule,
    PipeModule,
    NgxPageScrollModule,
    ModalModule,
  ],
  declarations: [
    AdminProjectDescriptionComponent
  ]
})

export class AdminProjectDescriptionModule {}
