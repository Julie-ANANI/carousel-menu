import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from '../../templates/sidebar/sidebar.module';

import { CollaboratorComponent } from './collaborator.component';

import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    MessageTemplateModule
  ],
  declarations: [
    CollaboratorComponent
  ],
  exports: [
    CollaboratorComponent
  ]
})

export class SidebarCollaboratorModule {}
