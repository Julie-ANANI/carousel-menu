import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrintExecutiveReportComponent } from './print-executive-report.component';

import { AuthGuard } from '../../../guards/auth-guard.service';
import { ExecutiveReportResolver } from '../../../resolvers/executive-report.resolver';

const reportRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
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
