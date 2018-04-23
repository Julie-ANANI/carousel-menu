import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { SharedMarketReportModule } from '../../../shared/components/shared-market-report/shared-market-report.module';
import { AdminProjectComponent } from './admin-project.component';
import { AdminProjectDetailsComponent } from './admin-project-details/admin-project-details.component';
import { AdminProjectCardsComponent } from './admin-project-cards/admin-project-cards.component';
import { AdminProjectCampaignsComponent } from './admin-project-campaigns/admin-project-campaigns.component';
import { AdminProjectSynthesisComponent } from './admin-project-synthesis/admin-project-synthesis.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedMarketReportModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminProjectComponent,
    AdminProjectDetailsComponent,
    AdminProjectCardsComponent,
    AdminProjectCampaignsComponent,
    AdminProjectSynthesisComponent
  ],
  exports: [
    AdminProjectComponent
  ]
})

export class AdminProjectModule {}
