import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarUserAnswerComponent } from './sidebar-user-answer.component';
import { AnswerQuestionComponent } from './answer-question/answer-question.component';
import { RatingItemComponent } from './rating-item/rating-item.component';

import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import { SharedTagsModule } from '../../../shared/components/shared-tags/shared-tags.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { InputListModule } from '../../../utility/input-list/input-list.module';
import { ReassignAnswerComponent } from './reassign-answer/reassign-answer.component';
import {BannerModule} from '../../../utility/banner/banner.module';
import { EditableTagLabelModule } from "../../../utility/editable-tag-label/editable-tag-label.module";
import { AutoCompleteCompanyModule, AutoCompleteCountryModule, CountryFlagModule } from '@umius/umi-common-component';
import {FormalizeUrlModule} from '../../../../pipe/formalize-url/formalize-url.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AutoCompleteInputModule,
    SharedTagsModule,
    PipeModule,
    InputListModule,
    BannerModule,
    EditableTagLabelModule,
    AutoCompleteCompanyModule,
    AutoCompleteCountryModule,
    CountryFlagModule,
    FormalizeUrlModule
  ],
  declarations: [
    SidebarUserAnswerComponent,
    AnswerQuestionComponent,
    RatingItemComponent,
    ReassignAnswerComponent
  ],
  exports: [
    SidebarUserAnswerComponent
  ]
})

export class SidebarUserAnswerModule {}
