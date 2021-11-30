import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { NewProjectComponent } from './new-project.component';

import { ObjectivesPrimaryModule } from '../objectives-primary/objectives-primary.module';
import { ObjectivesSecondaryModule } from '../objectives-secondary/objectives-secondary.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NewProjectWelcomeComponent } from './new-project-welcome/new-project-welcome.component';
import {MarketTestObjectivesModule} from '../market-test-objectives/market-test-objectives.module';
import { NewProjectLastStepComponent } from './new-project-last-step/new-project-last-step.component';
import {TextInputModule} from '../../../../utility/text-input/text-input.module';
import {DatePickerModule} from '../../../../utility/date-picker/date-picker.module';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import {NgxPageScrollCoreModule} from 'ngx-page-scroll-core';
import {NewProjectRoutingModule} from './new-project-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ObjectivesPrimaryModule,
    ObjectivesSecondaryModule,
    MarketTestObjectivesModule,
    AngularMyDatePickerModule,
    TextInputModule,
    DatePickerModule,
    NgxPageScrollModule,
    NewProjectRoutingModule,
    NgxPageScrollCoreModule
  ],
  declarations: [
    NewProjectComponent,
    NewProjectWelcomeComponent,
    NewProjectLastStepComponent
  ],
  exports: [
    NewProjectComponent
  ]
})

export class NewProjectModule {}
