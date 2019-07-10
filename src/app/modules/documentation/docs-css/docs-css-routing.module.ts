import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocsCssComponent } from './docs-css.component';

const docsCssRoutes: Routes = [
  {
    path: '',
    component: DocsCssComponent,
    pathMatch: 'full'
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
