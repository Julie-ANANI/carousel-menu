import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedUploadZoneVideoComponent } from './shared-upload-zone-video.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
  ],
  declarations: [
    SharedUploadZoneVideoComponent
  ],
  exports: [
    SharedUploadZoneVideoComponent
  ]
})

export class SharedUploadZoneVideoModule { }
