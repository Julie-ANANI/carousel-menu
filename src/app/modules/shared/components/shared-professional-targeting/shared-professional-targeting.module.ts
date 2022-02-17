import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedProfessionalTargetingComponent } from './shared-professional-targeting.component';
import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';
import { SharedSearchConfigProModule } from '../shared-search-config-pro/shared-search-config-pro.module';
import {SearchInput3Module} from '../../../utility/search-inputs/search-template-3/search-input-3.module';
import {SearchInputModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    MessageTemplateModule,
    SharedSearchConfigProModule,
    SearchInput3Module,
    SearchInputModule
  ],
  declarations: [
    SharedProfessionalTargetingComponent
  ],
  exports: [
    SharedProfessionalTargetingComponent
  ]
})

export class SharedProfessionalTargetingModule { }
