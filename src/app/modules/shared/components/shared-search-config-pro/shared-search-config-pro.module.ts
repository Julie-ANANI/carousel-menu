import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedSearchConfigProComponent } from './shared-search-config-pro.component';
import {ModalModule} from '../../../utility/modals/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
  ],
  declarations: [
    SharedSearchConfigProComponent
  ],
  exports: [
    SharedSearchConfigProComponent
  ]
})

export class SharedSearchConfigProModule { }
