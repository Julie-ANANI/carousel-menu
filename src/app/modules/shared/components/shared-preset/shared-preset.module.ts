import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SharedPresetQuestionComponent } from './shared-preset-question/shared-preset-question.component';
import { SharedPresetSectionComponent } from './shared-preset-section/shared-preset-section.component';
import { SharedPresetComponent } from './shared-preset.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    FormsModule,
    PipeModule,
    ColorPickerModule
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
