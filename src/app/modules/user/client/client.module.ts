import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';

import { ClientComponent } from './client.component';

import { ProjectModule } from './components/project/project.module';
import { AccountModule } from './components/account/account.module';
import { SynthesisListModule } from './components/synthesis-list/synthesis-list.module';
import { SynthesisCompleteModule } from '../../public/share/component/synthesis-complete/synthesis-complete.module';
import { MessageTemplateModule } from '../../utility/messages/message-template/message-template.module';
import { NewProjectModule } from './components/new-project/new-project.module';
import {ProjectsListModule} from './components/projects-list/projects-list.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ClientRoutingModule,
    ReactiveFormsModule,
    ProjectModule,
    AccountModule,
    ProjectsListModule,
    SynthesisListModule,
    SynthesisCompleteModule,
    MessageTemplateModule,
    NewProjectModule
  ],
  declarations: [
    ClientComponent,
  ],
  exports: [
    ClientComponent
  ]
})

export class ClientModule { }
