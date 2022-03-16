import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MissionPipe} from './mission.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MissionPipe,
  ],
  exports: [
    MissionPipe
  ]
})

export class MissionPipeModule {}
