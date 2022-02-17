import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarBatchComponent } from './sidebar-batch.component';

import { SharedEditorTinymceModule } from '../../../shared/components/shared-editor-tinymce/shared-editor-tinymce.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedEditorTinymceModule
  ],
  declarations: [
    SidebarBatchComponent
  ],
  exports: [
    SidebarBatchComponent
  ]
})

export class SidebarBatchModule {}
