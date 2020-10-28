import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {SharedEtherpadEditorComponent} from './shared-etherpad-editor.component';
import {CleanHtmlModule} from '../../../../pipe/cleanHtml/cleanHtml.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    CleanHtmlModule,
  ],
  declarations: [
    SharedEtherpadEditorComponent
  ],
  exports: [
    SharedEtherpadEditorComponent
  ]
})

export class SharedEtherpadEditorModule { }
