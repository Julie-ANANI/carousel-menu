import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { NewProjectComponent } from './new-project.component';

import { ObjectivesPrimaryModule } from '../objectives-primary/objectives-primary.module';
import { ObjectivesSecondaryModule } from '../objectives-secondary/objectives-secondary.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { MarketTestWelcomeComponent } from './market-test-welcome/market-test-welcome.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ObjectivesPrimaryModule,
    ObjectivesSecondaryModule,
    AngularMyDatePickerModule // https://github.com/kekeh/angular-mydatepicker
  ],
  declarations: [
    NewProjectComponent,
    MarketTestWelcomeComponent
  ],
  exports: [
    NewProjectComponent
  ]
})

export class NewProjectModule {}
