import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorAllComponent } from './error-all/error-all.component';
import { ErrorsGuard } from '../../../guards/errors.guard';

const errorsRoutes: Routes = [
  {
    path: '',
    canActivateChild: [ErrorsGuard],
    children: [
      {
        path: '',
        component: ErrorAllComponent,
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(errorsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ErrorsRoutingModule {}
