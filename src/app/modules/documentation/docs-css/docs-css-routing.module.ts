import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocsCssGuardService } from '../../../guards/docs-css-guard.service';

import { DocsCssComponent } from './docs-css.component';
import { OverviewComponent } from './overview/overview.component';
import { AccordionsComponent } from './components/accordions/accordions.component';
import { TypographyComponent } from './elements/typography/typography.component';
import { TableComponent } from './elements/table/table.component';
import { ButtonComponent } from './elements/button/button.component';
import { LabelComponent } from './elements/label/label.component';

const docsCssRoutes: Routes = [
  {
    path: '',
    component: DocsCssComponent,
    canActivateChild: [DocsCssGuardService],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent, pathMatch: 'full' },
      { path: 'elements/typography', component: TypographyComponent, pathMatch: 'full' },
      { path: 'elements/table', component: TableComponent, pathMatch: 'full' },
      { path: 'elements/label', component: LabelComponent, pathMatch: 'full' },
      { path: 'elements/button', component: ButtonComponent, pathMatch: 'full' },
      { path: 'components/accordions', component: AccordionsComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(docsCssRoutes)
  ],
  providers: [
    DocsCssGuardService
  ],
  exports: [
    RouterModule
  ]
})

export class DocsCssRoutingModule { }
