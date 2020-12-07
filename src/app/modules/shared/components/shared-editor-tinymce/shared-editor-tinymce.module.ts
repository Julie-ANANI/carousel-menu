// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedEditorTinymceComponent } from './shared-editor-tinymce.component';
import {CleanHtmlModule} from '../../../../pipe/cleanHtml/cleanHtml.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    CleanHtmlModule
  ],
  declarations: [
    SharedEditorTinymceComponent
  ],
  exports: [
    SharedEditorTinymceComponent
  ]
})

export class SharedEditorTinymceModule { }
