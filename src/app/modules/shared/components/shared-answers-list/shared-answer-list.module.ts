// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedAnswersListComponent } from './shared-answers-list.component';
import {InputModule} from '../../../input/input.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputModule,
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
