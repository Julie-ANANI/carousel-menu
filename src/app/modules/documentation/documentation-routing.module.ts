import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocsGuardService } from '../../guards/docs-guard.service';

import { DocumentationComponent } from './documentation.component';

const docsRoutes: Routes = [
  {
    path: '',
    component: DocumentationComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'application'},
      {path: 'application', loadChildren: './docs-css/docs-css.module#DocsCssModule'}
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(docsRoutes)
  ],
  providers: [
    DocsGuardService
  ],
  exports: [
    RouterModule
  ]
})

export class DocumentationRoutingModule { }
