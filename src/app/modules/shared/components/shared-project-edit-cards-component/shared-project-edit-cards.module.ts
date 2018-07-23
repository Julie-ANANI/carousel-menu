import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputModule } from '../../../input/input.module';
import { SharedProjectEditCardsComponent } from './shared-project-edit-cards.component';
import { SharedUploadZoneVideoModule } from '../shared-upload-zone-video/shared-upload-zone-video.module';
import { SharedUploadZonePhotoModule } from '../shared-upload-zone-photo/shared-upload-zone-photo.module';
import { SharedTextZoneModule } from '../shared-text-zone/shared-text-zone.module';
import { PipeModule } from '../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forChild(),
    InputModule,
    SharedUploadZoneVideoModule,
    SharedUploadZonePhotoModule,
    SharedTextZoneModule,
    PipeModule
  ],
  declarations: [
    SharedProjectEditCardsComponent
  ],
  exports: [
    SharedProjectEditCardsComponent
  ]
})

export class SharedProjectEditCardsModule { }
