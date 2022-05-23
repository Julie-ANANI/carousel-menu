import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedQuestionnaireMirrorViewComponent } from './shared-questionnaire-mirror-view.component';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
    ],
  declarations: [
    SharedQuestionnaireMirrorViewComponent
  ],
  exports: [
    SharedQuestionnaireMirrorViewComponent
  ]
})

export class SharedQuestionnaireMirrorViewModule { }
