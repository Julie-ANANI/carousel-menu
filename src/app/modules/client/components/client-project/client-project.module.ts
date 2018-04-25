import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMarketReportModule } from '../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedModule } from '../../../shared/shared.module';
import { ClientProjectComponent } from './client-project.component';
import { ExplorationProjectComponent } from './components/exploration/exploration.component';
import { SetupProjectComponent } from './components/setup/setup.component';


@NgModule({
  imports: [
    CommonModule,
    SharedMarketReportModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    ClientProjectComponent,
    ExplorationProjectComponent,
    SetupProjectComponent
  ],
  exports: [
    ClientProjectComponent
  ]
})

export class ClientProjectModule {}
