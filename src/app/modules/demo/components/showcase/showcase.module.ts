import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminSearchMapModule } from '../../../user/admin/components/admin-search/admin-search-map/admin-search-map.module';
import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';
import { ModalModule } from '../../../utility-components/modals/modal/modal.module';

import { ShowcaseAnswersComponent } from './components/showcase-answers/showcase-answers.component';
import { ShowcaseClientsComponent } from './components/showcase-clients/showcase-clients.component';
import { ShowcaseInnovationsComponent } from './components/showcase-innovations/showcase-innovations.component';
import { ShowcaseComponent } from './showcase.component';
import { ShowcaseService } from './services/showcase.service';
import { ShowcaseRoutingModule } from './showcase-routing.module';

import { AnswerService } from '../../../../services/answer/answer.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TagsService } from '../../../../services/tags/tags.service';
import { MultilingPipe } from '../../../../pipe/pipes/multiling.pipe';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SidebarModule } from '../../../sidebar/sidebar.module';
import { ShowcaseHistoryModule } from '../../../sidebar/components/showcase-history/showcase-history.module';
import { MessageTemplate1Module } from '../../../utility-components/messages/message-template-1/message-template-1.module';
import { ErrorTemplate1Module } from '../../../utility-components/errors/error-template-1/error-template-1.module';
import { MessageTemplate2Module } from '../../../utility-components/messages/message-template-2/message-template-2.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AdminSearchMapModule,
    CountryFlagModule,
    ModalModule,
    PipeModule,
    ShowcaseRoutingModule,
    SidebarModule,
    ShowcaseHistoryModule,
    MessageTemplate1Module,
    ErrorTemplate1Module,
    MessageTemplate2Module
  ],
  declarations: [
    ShowcaseAnswersComponent,
    ShowcaseClientsComponent,
    ShowcaseInnovationsComponent,
    ShowcaseComponent
  ],
  providers: [
    AnswerService,
    InnovationService,
    MultilingPipe,
    ShowcaseService,
    TagsService,
  ],
  exports: [
    ShowcaseComponent
  ]
})

export class ShowcaseModule { }
