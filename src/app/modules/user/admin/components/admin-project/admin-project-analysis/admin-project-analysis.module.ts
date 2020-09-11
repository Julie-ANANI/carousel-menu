import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {AdminProjectAnalysisComponent} from './admin-project-analysis.component';

import {AdminProjectSynthesisModule} from '../admin-project-synthesis/admin-project-synthesis.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminProjectSynthesisModule
  ],
  declarations: [
    AdminProjectAnalysisComponent
  ],
  exports: [
    AdminProjectAnalysisComponent
  ]
})

export class AdminProjectAnalysisModule {}
