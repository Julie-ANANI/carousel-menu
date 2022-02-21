import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminProjectStatisticsComponent} from './admin-project-statistics.component';
import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {MessageTemplateModule} from '../../../../../utility/messages/message-template/message-template.module';
import {CountryFlagModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    MessageErrorModule,
    MessageTemplateModule,
    CountryFlagModule,
  ],
  declarations: [
    AdminProjectStatisticsComponent
  ],
  exports: [
    AdminProjectStatisticsComponent
  ]
})

export class AdminProjectStatisticsModule {
}
