import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SharedMailEditorComponent } from './shared-mail-editor.component';

import { SharedEditorTinymceModule}  from '../shared-editor-tinymce/shared-editor-tinymce.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    SharedEditorTinymceModule,
  ],
  declarations: [
   SharedMailEditorComponent
  ],
  exports: [
    SharedMailEditorComponent
  ]
})

export class SharedMailEditorModule { }
