import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { WorkflowFormComponent } from './workflow-form.component';

import { SidebarModule } from '../../sidebar.module';
import { SidebarSignatureModule } from '../sidebar-signature/sidebar-signature.module';
import { SharedMailEditorModule } from '../../../shared/components/shared-mail-editor/shared-mail-editor.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    SidebarSignatureModule,
    SharedMailEditorModule
  ],
  declarations: [
   WorkflowFormComponent
  ],
  exports: [
    WorkflowFormComponent
  ]
})

export class SidebarWorkflowFormModule {}
