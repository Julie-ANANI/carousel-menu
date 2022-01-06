import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CountryFlagModule } from '../../../utility/country-flag/country-flag.module';
import { ModalModule } from '../../../utility/modals/modal/modal.module';

import { ShowcaseAnswersComponent } from './components/showcase-answers/showcase-answers.component';
import { ShowcaseClientsComponent } from './components/showcase-clients/showcase-clients.component';
import { ShowcaseInnovationsComponent } from './components/showcase-innovations/showcase-innovations.component';
import { ShowcaseComponent } from './showcase.component';
import { ShowcaseService } from './services/showcase.service';
import { ShowcaseRoutingModule } from './showcase-routing.module';

import { MultilingPipe } from '../../../../pipe/pipes/multiling.pipe';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SidebarModule } from '../../../sidebars/templates/sidebar/sidebar.module';
import { ShowcaseHistoryModule } from '../../../sidebars/components/showcase-history/showcase-history.module';
import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';
import { ErrorTemplate1Module } from '../../../utility/errors/error-template-1/error-template-1.module';
import { MessageTemplate2Module } from '../../../utility/messages/message-template-2/message-template-2.module';
import { SharedWorldmapModule } from '../../../shared/components/shared-worldmap/shared-worldmap.module';
import {LangEntryPipeModule} from '../../../../pipe/lang-entry/langEntryPipe.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        CountryFlagModule,
        ModalModule,
        PipeModule,
        ShowcaseRoutingModule,
        SidebarModule,
        ShowcaseHistoryModule,
        MessageTemplateModule,
        ErrorTemplate1Module,
        MessageTemplate2Module,
        SharedWorldmapModule,
        LangEntryPipeModule
    ],
  declarations: [
    ShowcaseAnswersComponent,
    ShowcaseClientsComponent,
    ShowcaseInnovationsComponent,
    ShowcaseComponent
  ],
  providers: [
    MultilingPipe,
    ShowcaseService
  ],
  exports: [
    ShowcaseComponent
  ]
})

export class ShowcaseModule { }
