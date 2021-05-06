import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedTargetingWorldComponent } from './shared-targeting-world.component';

import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import { ModalModule } from '../../../utility/modals/modal/modal.module';
import {SearchInput2Module} from '../../../utility/search-inputs/search-template-2/search-input-2.module';
import {PipeModule} from '../../../../pipe/pipe.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        AutoCompleteInputModule,
        ModalModule,
        SearchInput2Module,
        PipeModule,
    ],
  declarations: [
    SharedTargetingWorldComponent
  ],
  exports: [
    SharedTargetingWorldComponent
  ]
})

export class SharedTargetingWorldModule {}
