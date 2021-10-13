import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EditableTagLabelComponent } from './editable-tag-label.component';
import { NguiAutoCompleteModule } from "../auto-complete/auto-complete.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NguiAutoCompleteModule,
  ],
  declarations: [
    EditableTagLabelComponent
  ],
  exports: [
    EditableTagLabelComponent
  ]
})

export class EditableTagLabelModule {}
