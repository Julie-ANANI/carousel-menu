import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RanksComponent } from './ranks.component';
import {PipeModule} from '../../../../../../pipe/pipe.module';



@NgModule({
  declarations: [RanksComponent],
  exports: [
    RanksComponent
  ],
  imports: [
    CommonModule,
    PipeModule
  ]
})
export class RanksModule { }
