import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMarketReportModule } from '../../../shared/components/shared-market-report/shared-market-report.module';
import { SharedModule } from '../../../shared/shared.module';
import { ClientProjectComponent } from './client-project.component';
import { ExplorationProjectComponent } from './components/exploration/exploration.component';
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { ProjectEditExample1Component } from './components/project-edit-example1/project-edit-example1.component';
import { ProjectEditExample2Component } from './components/project-edit-example2/project-edit-example2.component';
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
    ProjectEditComponent,
    ProjectEditExample1Component,
    ProjectEditExample2Component,
    SetupProjectComponent
  ],
  exports: [
    ClientProjectComponent
  ]
})

export class ClientProjectModule {}
