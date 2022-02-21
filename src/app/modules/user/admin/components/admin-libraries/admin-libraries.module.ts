import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AdminLibrariesRoutingModule } from './admin-libraries-routing.module';

import { AdminLibrariesComponent } from './admin-libraries.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { AdminLibrariesWorkflowsModule } from './admin-libraries-workflows/admin-libraries-workflows.module';
import { AdminSignaturesLibraryModule } from './admin-signatures-library/admin-signatures-library.module';
import { AdminEmailsLibraryModule } from './admin-emails-library/admin-emails-library.module';
import { AdminPresetsModule } from './admin-presets/admin-presets.module';
import { SidebarBlacklistModule } from '../../../../sidebars/components/sidebar-blacklist/sidebar-blacklist.module';
import { MessageErrorModule } from '../../../../utility/messages/message-error/message-error.module';
import {AdminUseCasesLibraryModule} from './admin-use-cases-library/admin-use-cases-library.module';
import {AdminQuestionsLibraryModule} from './admin-questions-library/admin-questions-library.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    PipeModule,
    AdminLibrariesWorkflowsModule,
    AdminSignaturesLibraryModule,
    AdminUseCasesLibraryModule,
    AdminQuestionsLibraryModule,
    AdminEmailsLibraryModule,
    AdminPresetsModule,
    SidebarBlacklistModule,
    MessageErrorModule,
    AdminLibrariesRoutingModule
  ],
  declarations: [
    AdminLibrariesComponent
  ],
  exports: [
    AdminLibrariesComponent
  ]
})

export class AdminLibrariesModule {}
