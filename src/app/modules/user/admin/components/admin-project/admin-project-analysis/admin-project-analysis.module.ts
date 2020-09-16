import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {AdminProjectAnalysisComponent} from './admin-project-analysis.component';

import {AdminProjectSynthesisModule} from '../admin-project-synthesis/admin-project-synthesis.module';
import {AdminProjectTagsPoolModule} from '../admin-project-tags-pool/admin-project-tags-pool.module';
import {AdminProjectStoryboardModule} from '../admin-project-storyboard/admin-project-storyboard.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminProjectSynthesisModule,
    AdminProjectTagsPoolModule,
    AdminProjectStoryboardModule
  ],
  declarations: [
    AdminProjectAnalysisComponent
  ],
  exports: [
    AdminProjectAnalysisComponent
  ]
})

export class AdminProjectAnalysisModule {}
