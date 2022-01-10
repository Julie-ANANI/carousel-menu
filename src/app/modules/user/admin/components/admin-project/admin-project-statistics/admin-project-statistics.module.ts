import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminProjectStatisticsComponent} from './admin-project-statistics.component';
import {CountryFlagModule} from '@umius/umi-common-component/country-flag';
import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {MessageTemplateModule} from '../../../../../utility/messages/message-template/message-template.module';

@NgModule({
  imports: [
    CommonModule,
    CountryFlagModule,
    MessageErrorModule,
    MessageTemplateModule,
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
