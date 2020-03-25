import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ErrorAllComponent } from './error-all.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    ErrorAllComponent
  ],
  exports: [
    ErrorAllComponent
  ]
})

export class ErrorAllModule {}
