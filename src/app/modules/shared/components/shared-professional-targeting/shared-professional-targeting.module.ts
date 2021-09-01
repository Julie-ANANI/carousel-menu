import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedProfessionalTargetingComponent } from './shared-professional-targeting.component';
import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';
import { SharedSearchConfigProModule } from '../shared-search-config-pro/shared-search-config-pro.module';

@NgModule({
  imports: [
    CommonModule,
    MessageTemplateModule,
    SharedSearchConfigProModule,
  ],
  declarations: [
    SharedProfessionalTargetingComponent
  ],
  exports: [
    SharedProfessionalTargetingComponent
  ]
})

export class SharedProfessionalTargetingModule { }
