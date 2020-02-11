import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AdminProjectStoryboardComponent } from './admin-project-storyboard.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    AdminProjectStoryboardComponent
  ],
  exports: [
    AdminProjectStoryboardComponent
  ]
})

export class AdminProjectStoryboardModule { }
