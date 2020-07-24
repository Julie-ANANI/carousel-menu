import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarWorkflowFormComponent } from './sidebar-workflow-form.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
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
   SidebarWorkflowFormComponent
  ],
  exports: [
    SidebarWorkflowFormComponent
  ]
})

export class SidebarWorkflowFormModule {}
