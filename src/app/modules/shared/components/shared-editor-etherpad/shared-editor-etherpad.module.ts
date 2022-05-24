import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {SharedEditorEtherpadComponent} from './shared-editor-etherpad.component';
import {CleanHtmlModule} from '../../../../pipe/cleanHtml/cleanHtml.module';
import {MessageErrorModule} from '../../../utility/messages/message-error/message-error.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        CleanHtmlModule,
        MessageErrorModule
    ],
  declarations: [
    SharedEditorEtherpadComponent
  ],
  exports: [
    SharedEditorEtherpadComponent
  ]
})

export class SharedEditorEtherpadModule { }
