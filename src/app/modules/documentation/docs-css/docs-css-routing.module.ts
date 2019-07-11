import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocsCssComponent } from './docs-css.component';

import { OverviewComponent } from './overview/overview.component';

import { AccordionsComponent } from './components/accordions/accordions.component';


const docsCssRoutes: Routes = [
  {
    path: '',
    component: DocsCssComponent,
    children: [
      { path: '', component: OverviewComponent, pathMatch: 'full' },
      { path: 'accordions', component: AccordionsComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(docsCssRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})

export class DocsCssRoutingModule { }
