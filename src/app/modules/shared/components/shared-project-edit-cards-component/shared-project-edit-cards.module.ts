import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedProjectEditCardsComponent } from './shared-project-edit-cards.component';

import { SharedTextZoneModule } from '../shared-text-zone/shared-text-zone.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { InputListModule } from '../../../utility-components/input-list/input-list.module';
import { SharedUploadZonePhotoModule } from '../shared-upload-zone-photo/shared-upload-zone-photo.module';
import { SharedUploadZoneVideoModule } from '../shared-upload-zone-video/shared-upload-zone-video.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    SharedTextZoneModule,
    InputListModule,
    SharedUploadZonePhotoModule,
    SharedUploadZoneVideoModule
  ],
  declarations: [
    SharedProjectEditCardsComponent
  ],
  exports: [
    SharedProjectEditCardsComponent
  ]
})

export class SharedProjectEditCardsModule { }
