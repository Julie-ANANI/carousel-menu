import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedUploadZonePhotoComponent } from './shared-upload-zone-photo.component';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    FileDropModule
  ],
  declarations: [
    SharedUploadZonePhotoComponent
  ],
  exports: [
    SharedUploadZonePhotoComponent
  ]
})

export class SharedUploadZonePhotoModule { }
