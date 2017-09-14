import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import {ChartsModule} from 'ng2-charts';
import {SharedModule} from '../../shared.module';

import { SharedInfographicComponent } from './components/shared-infographic/shared-infographic.component';
import { SharedInfographicContainerComponent } from './components/shared-infographic-container/shared-infographic-container.component';
import { SharedInfographicAnswerStringComponent } from './components/shared-infographic-answers/shared-infographic-answer-string/shared-infographic-answer-string.component';
import { SharedInfographicCommentComponent } from './components/shared-infographic-answers/shared-infographic-comment/shared-infographic-comment.component';
import { SharedInfographicSynthesisComponent } from './components/shared-infographic-synthesis/shared-infographic-synthesis.component';
import { SharedInfographicAnswersComponent } from './components/shared-infographic-answers/shared-infographic-answers.component';
import { SharedInfographicSynthesisStringComponent } from './components/shared-infographic-synthesis/shared-infographic-synthesis-string/shared-infographic-synthesis-string.component';
import { SharedInfographicSynthesisNumberComponent } from './components/shared-infographic-synthesis/shared-infographic-synthesis-number/shared-infographic-synthesis-number.component';
import { SharedInfographicSynthesisQCMComponent } from './components/shared-infographic-synthesis/shared-infographic-synthesis-qcm/shared-infographic-synthesis-qcm.component';
import { SharedInfographicSynthesisWorldmapComponent } from './components/shared-infographic-synthesis/shared-infographic-synthesis-worldmap/shared-infographic-synthesis-worldmap.component';
import { SharedInfographicProfessionalCardComponent } from './components/shared-infographic-professional-card/shared-infographic-professional-card.component';
import { SharedInfographicAnswersQcmComponent } from './components/shared-infographic-answers/shared-infographic-answers-qcm/shared-infographic-answers-qcm.component';
import { SharedInfographicWorldmapComponent } from './components/shared-infographic-worldmap/shared-infographic-worldmap.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    NgPipesModule,
    ChartsModule,

    SharedModule
  ],
  declarations: [
    SharedInfographicComponent,
    SharedInfographicSynthesisComponent,
    SharedInfographicSynthesisStringComponent,
    SharedInfographicSynthesisNumberComponent,
    SharedInfographicSynthesisQCMComponent,
    SharedInfographicSynthesisWorldmapComponent,
    SharedInfographicContainerComponent,
    SharedInfographicAnswersComponent,
    SharedInfographicAnswersQcmComponent,
    SharedInfographicAnswerStringComponent,
    SharedInfographicCommentComponent,
    SharedInfographicProfessionalCardComponent,
    SharedInfographicWorldmapComponent
  ]
})
export class SharedInfographicModule { }
