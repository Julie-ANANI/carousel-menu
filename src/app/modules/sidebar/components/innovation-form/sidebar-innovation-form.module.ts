import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { InnovationFormComponent } from './innovation-form.component';

import { SidebarModule } from '../../sidebar.module';
import { SharedMailEditorModule } from '../../../shared/components/shared-mail-editor/shared-mail-editor.module';
import { SharedProjectEditCardsModule } from '../../../shared/components/shared-project-edit-cards-component/shared-project-edit-cards.module';
import { SharedProjectSettingsModule } from '../../../shared/components/shared-project-settings-component/shared-project-settings.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    SharedMailEditorModule,
    SharedProjectEditCardsModule,
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
