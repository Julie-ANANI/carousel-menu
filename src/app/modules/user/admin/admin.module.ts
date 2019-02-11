import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { DashboardService } from '../../../services/dashboard/dashboard.service';

import { AdminSearchModule } from './components/admin-search/admin-search.module';
import { AdminUsersModule } from './components/admin-users/admin-users.module';
import { AdminProfessionalsModule } from './components/admin-professionals/admin-professionals.module';
import { AdminMonitoringModule } from './components/admin-monitoring/admin-monitoring.module';
import { AdminTagModule } from './components/admin-tags/admin-tag.module';
import { AdminProjectModule } from './components/admin-project/admin-project.module';
import { AdminProjectsModule } from './components/admin-projects/admin-projects.module';
import { AdminCampaignsModule } from './components/admin-campaigns/admin-campaigns.module';
import { AdminLibrariesModule } from './components/admin-libraries/admin-libraries.module';
import { AdminCountryManagementModule } from './components/admin-settings/admin-country-management/admin-country-management.module';
import { PipeModule } from '../../../pipe/pipe.module';
import { SidebarModule } from '../../sidebar/sidebar.module';
import { LogoutModule } from '../../common/logout/logout.module';
import { InputListModule } from '../../utility-components/input-list/input-list.module';
import { SidebarInnovationPreviewModule } from '../../sidebar/components/innovation-preview/sidebar-innovation-preview.module';
import { AdminDashboardModule } from './components/admin-dashboard/admin-dashboard.module';
import { HeaderModule } from '../../common/header/header.module';
import { AdminCommunityModule } from "./components/admin-community/admin-community.module";

import { SearchService } from '../../../services/search/search.service';
import { FrontendService } from '../../../services/frontend/frontend.service';
import { ProfessionalsService } from '../../../services/professionals/professionals.service';
import { TemplatesService } from '../../../services/templates/templates.service';
import { PresetService } from '../../../services/preset/preset.service';
import { EmailService } from '../../../services/email/email.service';
import { TagsService } from '../../../services/tags/tags.service';
import { CampaignService } from '../../../services/campaign/campaign.service';
import { CampaignResolver } from '../../../resolvers/campaign.resolver';
import { CommonService } from '../../../services/common/common.service';
import { AnswerService } from '../../../services/answer/answer.service';
import { AutocompleteService } from '../../../services/autocomplete/autocomplete.service';
import { DownloadService } from '../../../services/download/download.service';
import { RequestResolver } from '../../../resolvers/request.resolver';
import { ScenarioResolver } from '../../../resolvers/scenario.resolver';
import { SignatureResolver } from '../../../resolvers/signature.resolver';
import { CampaignCalculationService } from '../../../services/campaign/campaign-calculation.service';
import { QuizService } from '../../../services/quiz/quiz.service';
import { InnovationCommonService } from '../../../services/innovation/innovation-common.service';
import { PresetResolver } from '../../../resolvers/preset.resolver';
import { AdvSearchService } from "../../../services/advsearch/advsearch.service";


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminSearchModule,
    AdminMonitoringModule,
    AdminUsersModule,
    AdminProjectsModule,
    AdminProfessionalsModule,
    AdminLibrariesModule,
    AdminTagModule,
    AdminDashboardModule,
    AdminCampaignsModule,
    AdminProjectModule,
    TranslateModule.forChild(),
    SidebarModule,
    PipeModule,
    AdminCountryManagementModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderModule,
    LogoutModule,
    InputListModule,
    SidebarInnovationPreviewModule,
    AdminCommunityModule
  ],
  declarations: [
    AdminComponent,
    AdminIndexComponent,
    AdminPatentsComponent,
    AdminUserDetailsComponent,
    AdminSettingsComponent
  ],
  providers: [
    DashboardService,
    SearchService,
    FrontendService,
    ProfessionalsService,
    TemplatesService,
    PresetService,
    EmailService,
    TagsService,
    CampaignService,
    CampaignResolver,
    CommonService,
    AnswerService,
    AutocompleteService,
    DownloadService,
    RequestResolver,
    ScenarioResolver,
    SignatureResolver,
    RequestResolver,
    CampaignCalculationService,
    QuizService,
    InnovationCommonService,
    PresetResolver,
    AdvSearchService
  ]
})

export class AdminModule {}
