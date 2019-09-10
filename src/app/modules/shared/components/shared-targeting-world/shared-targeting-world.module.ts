import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedTargetingWorldComponent } from './shared-targeting-world.component';

import { AutocompleteInputModule } from '../../../utility-components/autocomplete-input/autocomplete-input.module';
import { ModalModule } from '../../../utility-components/modals/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    AutocompleteInputModule,
    ModalModule
  ],
  declarations: [
    SharedTargetingWorldComponent
  ],
  exports: [
    SharedTargetingWorldComponent
  ]
})

export class SharedTargetingWorldModule {}
