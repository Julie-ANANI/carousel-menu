import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SharedProjectEditCardsComponent } from './shared-project-edit-cards.component';

import { SharedTextZoneModule } from '../shared-text-zone/shared-text-zone.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { InputListModule } from '../../../utility-components/input-list/input-list.module';
import { SharedUploadZonePhotoModule } from '../shared-upload-zone-photo/shared-upload-zone-photo.module';
import { SharedUploadZoneVideoModule } from '../shared-upload-zone-video/shared-upload-zone-video.module';
import { MessageTemplate1Module } from '../../../utility-components/messages/message-template-1/message-template-1.module';
import { ModalModule } from '../../../utility-components/modals/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    PipeModule,
    SharedTextZoneModule,
    InputListModule,
    SharedUploadZonePhotoModule,
    SharedUploadZoneVideoModule,
    MessageTemplate1Module,
    ModalModule
  ],
  declarations: [
    SharedProjectEditCardsComponent
  ],
  exports: [
    SharedProjectEditCardsComponent
  ]
})

export class SharedProjectEditCardsModule { }
