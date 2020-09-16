import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {AdminProjectDescriptionComponent} from './admin-project-description.component';
import {FormsModule} from '@angular/forms';
import {SharedTextZoneModule} from '../../../../../shared/components/shared-text-zone/shared-text-zone.module';
import {ModalEmptyModule} from '../../../../../utility/modals/modal-empty/modal-empty.module';
import {SharedUploadZonePhotoModule} from '../../../../../shared/components/shared-upload-zone-photo/shared-upload-zone-photo.module';
import {SharedUploadZoneVideoModule} from '../../../../../shared/components/shared-upload-zone-video/shared-upload-zone-video.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedTextZoneModule,
    ModalEmptyModule,
    SharedUploadZonePhotoModule,
    SharedUploadZoneVideoModule,
  ],
  declarations: [
    AdminProjectDescriptionComponent,
  ]
})

export class AdminProjectDescriptionModule {}
