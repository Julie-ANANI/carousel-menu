import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SidebarProjectPitchComponent } from './sidebar-project-pitch.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
import { SharedEditorTinymceModule } from '../../../shared/components/shared-editor-tinymce/shared-editor-tinymce.module';
import { SharedUploadZonePhotoModule } from '../../../shared/components/shared-upload-zone-photo/shared-upload-zone-photo.module';
import { SharedUploadZoneVideoModule } from '../../../shared/components/shared-upload-zone-video/shared-upload-zone-video.module';
import {CommentCardModule} from '../comment-card/comment-card.module';
import {CommentListModule} from '../comment-list/comment-list.module';
import {SharedEditorsModule} from '../../../shared/components/shared-editors/shared-editors.module';
import {CleanHtmlModule} from '../../../../pipe/cleanHtml/cleanHtml.module';
import {PipeModule} from '../../../../pipe/pipe.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        SidebarModule,
        FormsModule,
        SharedEditorTinymceModule,
        SharedUploadZonePhotoModule,
        SharedUploadZoneVideoModule,
        CommentCardModule,
        CommentListModule,
        SharedEditorsModule,
        CleanHtmlModule,
        PipeModule,
    ],
  declarations: [
    SidebarProjectPitchComponent
  ],
  exports: [
    SidebarProjectPitchComponent
  ]
})

export class SidebarProjectPitchModule {}
