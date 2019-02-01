import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import {SharedMailEditorComponent} from './shared-mail-editor.component';
import {FormsModule} from '@angular/forms';
import {SharedTextZoneModule} from '../shared-text-zone/shared-text-zone.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
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
