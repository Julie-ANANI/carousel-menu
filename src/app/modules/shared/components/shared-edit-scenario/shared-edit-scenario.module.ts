// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {SharedEditEmailsStepModule} from '../shared-edit-emails-step/shared-edit-emails-step.module';

// Components
import { SharedEditScenarioComponent} from './shared-edit-scenario.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedEditEmailsStepModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedEditScenarioComponent
  ],
  exports: [
    SharedEditScenarioComponent
  ]
})

export class SharedEditScenarioModule { }
