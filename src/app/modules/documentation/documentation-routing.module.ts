import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../guards/auth-guard.service';
import { DocsGuardService } from '../../guards/docs-guard.service';

import { DocumentationComponent } from './documentation.component';

const docsRoutes: Routes = [
  {
    path: '',
    component: DocumentationComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'application'
      },
      {
        path: 'application',
        loadChildren: './docs-css/docs-css.module#DocsCssModule'
      },
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
