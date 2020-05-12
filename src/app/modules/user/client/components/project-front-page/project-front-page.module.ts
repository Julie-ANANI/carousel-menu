import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ProjectFrontPageComponent } from './project-front-page.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ProjectFrontPageComponent
  ],
  exports: [
    ProjectFrontPageComponent
  ]
})

export class ProjectFrontPageModule {}
