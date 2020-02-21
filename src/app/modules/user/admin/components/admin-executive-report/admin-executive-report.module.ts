import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ExecutiveConclusionComponent } from './executive-conclusion/executive-conclusion.component';
import { ExecutiveProfessionalComponent } from './executive-professional/executive-professional.component';
import { ExecutiveSectionComponent } from './executive-section/executive-section.component';
import { AdminExecutiveReportComponent } from './admin-executive-report.component';
import { ExecutiveObjectiveComponent } from './executive-objective/executive-objective.component';
import { TypeKpiComponent } from './executive-section/type-kpi/type-kpi.component';
import { TypeQuoteComponent } from './executive-section/type-quote/type-quote.component';
import { ExecutivePitchComponent } from './executive-pitch/executive-pitch.component';
import { ExecutiveTargetingComponent } from './executive-targeting/executive-targeting.component';
import { TypeBarComponent } from './executive-section/type-bar/type-bar.component';
import { TypeRankingComponent } from './executive-section/type-ranking/type-ranking.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { CountryFlagModule } from '../../../../utility-components/country-flag/country-flag.module';
import { SharedWorldmapModule } from '../../../../shared/components/shared-worldmap/shared-worldmap.module';
import { ProgressBarModule } from '../../../../utility-components/progress-bar/progress-bar.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    PipeModule,
    RouterModule,
    SharedWorldmapModule,
    CountryFlagModule,
    FormsModule,
    ProgressBarModule
  ],
  declarations: [
    ExecutiveConclusionComponent,
    ExecutiveProfessionalComponent,
    ExecutiveSectionComponent,
    AdminExecutiveReportComponent,
    ExecutiveObjectiveComponent,
    ExecutivePitchComponent,
    ExecutiveTargetingComponent,
    TypeKpiComponent,
    TypeQuoteComponent,
    TypeBarComponent,
    TypeRankingComponent
  ],
  exports: [
    AdminExecutiveReportComponent
  ]
})

export class AdminExecutiveReportModule {}
