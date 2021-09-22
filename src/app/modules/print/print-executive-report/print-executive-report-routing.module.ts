import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrintExecutiveReportComponent } from './print-executive-report.component';

import { ExecutiveReportResolver } from '../../../resolvers/executive-report.resolver';

const reportRoutes: Routes = [
  {
    path: '',
    component: PrintExecutiveReportComponent,
    resolve: { report: ExecutiveReportResolver },
    runGuardsAndResolvers: 'always',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class PrintExecutiveReportRoutingModule {}
