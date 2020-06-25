import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnovCardTitlePipe } from './InnovCardTitle.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InnovCardTitlePipe,
  ],
  exports: [
    InnovCardTitlePipe
  ]
})

export class InnovCardTitlePipeModule {}
