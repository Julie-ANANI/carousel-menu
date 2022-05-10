import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedQuestionnaireMirrorViewComponent } from './shared-questionnaire-mirror-view.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SharedQuestionnaireMirrorViewComponent
  ],
  exports: [
    SharedQuestionnaireMirrorViewComponent
  ]
})

export class SharedQuestionnaireMirrorViewModule { }
