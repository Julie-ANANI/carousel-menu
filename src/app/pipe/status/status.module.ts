import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusPipe } from './status.pipe';



@NgModule({
  declarations: [StatusPipe],
  exports: [
    StatusPipe
  ],
  imports: [
    CommonModule
  ]
})
export class StatusModule { }
