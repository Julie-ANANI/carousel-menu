import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { TypePieComponent } from './executive-section/type-pie/type-pie.component';
import { TypeLikertScaleComponent } from './executive-section/type-likert-scale/type-likert-scale.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { CountryFlagModule } from '../../../../utility/country-flag/country-flag.module';
import { SharedWorldmapModule } from '../../../../shared/components/shared-worldmap/shared-worldmap.module';
import { ProgressBarModule } from '../../../../utility/progress-bar/progress-bar.module';
import { PiechartExecutiveModule } from '../../../../utility/canvas/piechart-executive/piechart-executive.module';
import { ModalModule } from '../../../../utility/modals/modal/modal.module';
import { NguiAutoCompleteModule } from '../../../../utility/auto-complete/auto-complete.module';
import { AutoCompleteInputModule } from '../../../../utility/auto-complete-input/auto-complete-input.module';
import { SharedUploadZonePhotoModule } from "../../../../shared/components/shared-upload-zone-photo/shared-upload-zone-photo.module";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        PipeModule,
        RouterModule,
        SharedWorldmapModule,
        CountryFlagModule,
        FormsModule,
        ProgressBarModule,
        PiechartExecutiveModule,
        ModalModule,
        NguiAutoCompleteModule,
        AutoCompleteInputModule,
        ReactiveFormsModule,
        SharedUploadZonePhotoModule
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
    TypeRankingComponent,
    TypePieComponent,
    TypeLikertScaleComponent
  ],
  exports: [
    AdminExecutiveReportComponent
  ]
})

export class AdminExecutiveReportModule {}
