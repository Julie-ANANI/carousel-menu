import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedProjectDescriptionComponent } from './shared-project-description.component';
import { RouterModule } from '@angular/router';
import { SharedVideoModule } from '../shared-video/shared-video.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    SharedVideoModule
  ],
  declarations: [
    SharedProjectDescriptionComponent
  ],
  exports: [
    SharedProjectDescriptionComponent
  ]
})

export class SharedProjectDescriptionModule { }
