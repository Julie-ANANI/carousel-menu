import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {SharedEditorsComponent} from './shared-editors.component';

import {SharedEditorEtherpadModule} from '../shared-editor-etherpad/shared-editor-etherpad.module';
import {SharedEditorTinymceModule} from '../shared-editor-tinymce/shared-editor-tinymce.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SharedEditorEtherpadModule,
    SharedEditorTinymceModule
  ],
  declarations: [
    SharedEditorsComponent
  ],
  exports: [
    SharedEditorsComponent
  ]
})

export class SharedEditorsModule { }
