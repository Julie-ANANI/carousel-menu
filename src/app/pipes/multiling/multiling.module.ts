import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultilingPipe } from './multiling.pipe';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ MultilingPipe ],
  exports: [ MultilingPipe ]
})

export class MultilingModule {}
