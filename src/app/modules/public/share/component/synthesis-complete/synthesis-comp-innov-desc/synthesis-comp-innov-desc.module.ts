import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SynthesisCompInnovDescComponent } from './synthesis-comp-innov-desc.component';

import {PipeModule} from '../../../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    PipeModule
  ],
  declarations: [
    SynthesisCompInnovDescComponent
  ],
  exports: [
    SynthesisCompInnovDescComponent
  ]
})

export class SynthesisCompInnovDescModule {}
