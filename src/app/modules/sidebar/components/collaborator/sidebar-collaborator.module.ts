import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from '../../sidebar.module';

import { CollaboratorComponent } from './collaborator.component';

import { MessageSpaceModule } from '../../../utility-components/messages/message-template-1/message-space.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    MessageSpaceModule
  ],
  declarations: [
    CollaboratorComponent
  ],
  exports: [
    CollaboratorComponent
  ]
})

export class SidebarCollaboratorModule {}
