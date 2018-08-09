import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedLoaderModule } from '../shared-loader/shared-loader.module';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SharedPresetQuestionComponent } from './shared-preset-question/shared-preset-question.component';
import { SharedPresetSectionComponent } from './shared-preset-section/shared-preset-section.component';
import { SharedPresetComponent } from './shared-preset.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedLoaderModule,
    PipeModule
  ],
  declarations: [
    SharedPresetQuestionComponent,
    SharedPresetSectionComponent,
    SharedPresetComponent
  ],
  exports: [
    SharedPresetComponent
  ]
})

export class SharedPresetModule {}
