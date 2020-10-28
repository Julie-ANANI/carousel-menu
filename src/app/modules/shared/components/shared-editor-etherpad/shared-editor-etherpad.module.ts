import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {SharedEditorEtherpadComponent} from './shared-editor-etherpad.component';
import {CleanHtmlModule} from '../../../../pipe/cleanHtml/cleanHtml.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    CleanHtmlModule,
  ],
  declarations: [
    SharedEditorEtherpadComponent
  ],
  exports: [
    SharedEditorEtherpadComponent
  ]
})

export class SharedEditorEtherpadModule { }
