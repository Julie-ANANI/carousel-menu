import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { InnovationFormComponent } from './innovation-form.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
import { SharedMailEditorModule } from '../../../shared/components/shared-mail-editor/shared-mail-editor.module';
import { SharedProjectSettingsModule } from '../../../shared/components/shared-project-settings-component/shared-project-settings.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    SharedMailEditorModule,
    SharedProjectSettingsModule
  ],
  declarations: [
    InnovationFormComponent
  ],
  exports: [
    InnovationFormComponent
  ]
})

export class SidebarInnovationFormModule {}
