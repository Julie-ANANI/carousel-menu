import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedProfessionalTargetingComponent } from './shared-professional-targeting.component';
import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';
import { SharedSearchConfigProModule } from '../shared-search-config-pro/shared-search-config-pro.module';
import {SearchInput3Module} from '../../../utility/search-inputs/search-template-3/search-input-3.module';
import {SearchInput2Module} from '../../../utility/search-inputs/search-template-2/search-input-2.module';

@NgModule({
  imports: [
    CommonModule,
    MessageTemplateModule,
    SharedSearchConfigProModule,
    SearchInput3Module,
    SearchInput2Module,
  ],
  declarations: [
    SharedProfessionalTargetingComponent
  ],
  exports: [
    SharedProfessionalTargetingComponent
  ]
})

export class SharedProfessionalTargetingModule { }
