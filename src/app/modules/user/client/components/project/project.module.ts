import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectRoutingModule } from './project-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { ProjectComponent } from './project.component';
import { SetupComponent } from './components/setup/setup.component';
import { ExplorationComponent } from './components/exploration/exploration.component';
import { HistoryProjectComponent } from './components/history/history.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { PitchComponent } from './components/setup/components/pitch/pitch.component';
import { TargetingComponent } from './components/setup/components/targeting/targeting.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { SidebarModule } from '../../../../sidebars/templates/sidebar/sidebar.module';
import { SharedProjectSettingsModule } from '../../../../shared/components/shared-project-settings-component/shared-project-settings.module';
import { TableModule } from '../../../../table/table.module';
import { SharedWorldmapModule } from '../../../../shared/components/shared-worldmap/shared-worldmap.module';
import { SidebarUserAnswerModule } from '../../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module';
import { SharedMarketReportModule } from '../../../../shared/components/shared-market-report/shared-market-report.module';
import { MessageTemplateModule } from '../../../../utility/messages/message-template/message-template.module';
import { ModalModule } from '../../../../utility/modals/modal/modal.module';
import { SharedEditorTinymceModule } from '../../../../shared/components/shared-editor-tinymce/shared-editor-tinymce.module';
import { ObjectivesSecondaryModule } from '../objectives-secondary/objectives-secondary.module';
import { ModalEmptyModule } from '../../../../utility/modals/modal-empty/modal-empty.module';
import { ObjectivesPrimaryModule } from '../objectives-primary/objectives-primary.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AutoSuggestionModule } from '../../../../utility/auto-suggestion/auto-suggestion.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { BannerModule } from '../../../../utility/banner/banner.module';
import { SidebarProjectPitchModule } from '../../../../sidebars/components/sidebar-project-pitch/sidebar-project-pitch.module';
import { InnovCardTitlePipeModule } from '../../../../../pipe/InnovCardTitle/innovCardTitlePipe.module';
import { SynthesisComponent } from './components/synthesis/synthesis.component';
import { MessageErrorModule } from '../../../../utility/messages/message-error/message-error.module';
import {CleanHtmlModule} from '../../../../../pipe/cleanHtml/cleanHtml.module';

@NgModule({
    imports: [
        CommonModule,
        ProjectRoutingModule,
        TranslateModule.forChild(),
        PipeModule,
        SidebarModule,
        SharedProjectSettingsModule,
        TableModule,
        SharedWorldmapModule,
        SidebarUserAnswerModule,
        SharedMarketReportModule,
        MessageTemplateModule,
        ModalModule,
        FormsModule,
        SharedEditorTinymceModule,
        ObjectivesSecondaryModule,
        ModalEmptyModule,
        ObjectivesPrimaryModule,
        AngularMyDatePickerModule,
        AutoSuggestionModule,
        NgxPageScrollModule,
        BannerModule,
        SidebarProjectPitchModule,
        InnovCardTitlePipeModule,
        MessageErrorModule,
        CleanHtmlModule
    ],
  declarations: [
    ProjectComponent,
    SetupComponent,
    ExplorationComponent,
    HistoryProjectComponent,
    SettingsComponent,
    DocumentsComponent,
    PitchComponent,
    TargetingComponent,
    SynthesisComponent
  ],
  exports: [
    ProjectComponent
  ]
})

export class ProjectModule {}
