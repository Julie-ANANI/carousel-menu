import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedVideoComponent } from './shared-video.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    SharedVideoComponent
  ],
  exports: [
    SharedVideoComponent
  ]
})

export class SharedVideoModule { }
