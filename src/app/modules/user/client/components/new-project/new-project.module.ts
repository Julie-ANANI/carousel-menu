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
    // https://github.com/kekeh/angular-mydatepicker
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
