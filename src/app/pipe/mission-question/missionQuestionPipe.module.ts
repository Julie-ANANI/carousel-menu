import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MissionQuestionPipe} from './mission-question.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MissionQuestionPipe,
  ],
  exports: [
    MissionQuestionPipe
  ]
})

export class MissionQuestionPipeModule {}
