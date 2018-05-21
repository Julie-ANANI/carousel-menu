import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectKeysPipe } from './objectKeys.pipe';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ ObjectKeysPipe ],
  exports: [ ObjectKeysPipe ]
})

export class ObjectKeysModule {}
