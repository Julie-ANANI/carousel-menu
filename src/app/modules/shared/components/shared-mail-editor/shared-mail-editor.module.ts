import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SharedMailEditorComponent } from './shared-mail-editor.component';

import { SharedTextZoneModule}  from '../shared-text-zone/shared-text-zone.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    SharedTextZoneModule,
  ],
  declarations: [
   SharedMailEditorComponent
  ],
  exports: [
    SharedMailEditorComponent
  ]
})

export class SharedMailEditorModule { }
