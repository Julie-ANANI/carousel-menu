import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { SharedModule } from '../../../shared/shared.module';
import { SharedMarketReportModule } from '../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedSortModule } from '../../../shared/components/shared-sort/sort.module';
import {AutocompleteInputModule} from '../../../../directives/autocomplete-input/autocomplete-input.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { GlobalModule } from '../../../global/global.module';

import { AdminProjectComponent } from './admin-project.component';
import { AdminProjectDetailsComponent } from './admin-project-details/admin-project-details.component';
import { AdminProjectCardsComponent } from './admin-project-cards/admin-project-cards.component';
import { AdminProjectCampaignsComponent } from './admin-project-campaigns/admin-project-campaigns.component';
import { AdminProjectSynthesisComponent } from './admin-project-synthesis/admin-project-synthesis.component';
import { AdminProjectTagsPoolComponent } from './admin-project-tags-pool/admin-project-tags-pool.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedSortModule,
    GlobalModule,
    SharedMarketReportModule,
    TranslateModule.forChild(),
    Ng2AutoCompleteModule,
    AutocompleteInputModule,
    PipeModule
  ],
  declarations: [
    AdminProjectComponent,
    AdminProjectDetailsComponent,
    AdminProjectCardsComponent,
    AdminProjectCampaignsComponent,
    AdminProjectSynthesisComponent,
    AdminProjectTagsPoolComponent
  ],
  exports: [
    AdminProjectComponent
  ]
})

export class AdminProjectModule {}
