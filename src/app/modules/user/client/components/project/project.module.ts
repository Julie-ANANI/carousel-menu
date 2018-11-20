import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectComponent } from './project.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ProjectComponent
  ],
  exports: [
    ProjectComponent
  ]
})

export class ProjectModule {}
