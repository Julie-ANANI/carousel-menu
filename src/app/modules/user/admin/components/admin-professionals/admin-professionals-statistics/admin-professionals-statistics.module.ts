import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminProfessionalsStatisticsComponent} from './admin-professionals-statistics.component';
import {ErrorTemplate1Module} from '../../../../../utility/errors/error-template-1/error-template-1.module';
import {PipeModule} from '../../../../../../pipe/pipe.module';
import {LangEntryPipeModule} from '../../../../../../pipe/lang-entry/langEntryPipe.module';

@NgModule({
  declarations: [AdminProfessionalsStatisticsComponent],
  imports: [
    CommonModule,
    ErrorTemplate1Module,
    PipeModule,
    LangEntryPipeModule
  ],
  exports: [
    AdminProfessionalsStatisticsComponent
  ]
})
export class AdminProfessionalsStatisticsModule {
}
