import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EditableTagLabelComponent } from './editable-tag-label.component';
import { NguiAutoCompleteModule } from "../auto-complete/auto-complete.module";
import { PipeModule } from "../../../pipe/pipe.module";
import {ModalModule} from '@umius/umi-common-component';
import {LangEntryPipeModule} from '../../../pipe/lang-entry/langEntryPipe.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        NguiAutoCompleteModule,
        PipeModule,
        ModalModule,
        LangEntryPipeModule,
    ],
  declarations: [
    EditableTagLabelComponent
  ],
  exports: [
    EditableTagLabelComponent
  ]
})

export class EditableTagLabelModule {}
