// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedEditEmailModule } from '../shared-edit-email/shared-edit-email.module';

// Components
import { SharedEditEmailsStep } from './shared-edit-emails-step.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedEditEmailModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedEditEmailsStep
  ],
  exports: [
    SharedEditEmailsStep
  ]
})

export class SharedEditEmailsStepModule { }
