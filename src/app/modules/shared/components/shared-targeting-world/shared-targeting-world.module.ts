import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedTargetingWorldComponent } from './shared-targeting-world.component';

import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import {PipeModule} from '../../../../pipe/pipe.module';
import {SearchInputModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    AutoCompleteInputModule,
    PipeModule,
    SearchInputModule,
  ],
  declarations: [
    SharedTargetingWorldComponent
  ],
  exports: [
    SharedTargetingWorldComponent
  ]
})

export class SharedTargetingWorldModule {}
