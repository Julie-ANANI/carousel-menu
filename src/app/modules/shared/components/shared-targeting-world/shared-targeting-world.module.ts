import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedTargetingWorldComponent } from './shared-targeting-world.component';

import { AutoCompleteInputModule } from '../../../utility-components/auto-complete-input/auto-complete-input.module';
import { ModalModule } from '../../../utility-components/modals/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    AutoCompleteInputModule,
    ModalModule,
  ],
  declarations: [
    SharedTargetingWorldComponent
  ],
  exports: [
    SharedTargetingWorldComponent
  ]
})

export class SharedTargetingWorldModule {}
