import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SharedMarketReportExampleComponent } from './shared-market-report-example.component';
import { PipeModule } from '../../../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    PipeModule
  ],
  declarations: [
    SharedMarketReportExampleComponent
  ],
  exports: [
    SharedMarketReportExampleComponent
  ]
})

export class SharedMarketReportExampleModule { }
