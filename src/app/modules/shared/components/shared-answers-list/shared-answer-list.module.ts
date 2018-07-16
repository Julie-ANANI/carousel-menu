// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CountryFlagModule } from '../../../../directives/country-flag/country-flag.module';

// Components
import { SharedAnswersListComponent } from './shared-answers-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CountryFlagModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedAnswersListComponent
  ],
  exports: [
    SharedAnswersListComponent
  ]
})

export class SharedAnswerListModule { }
