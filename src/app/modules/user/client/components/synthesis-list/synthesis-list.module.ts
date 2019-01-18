import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SynthesisListComponent } from './synthesis-list.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule
  ],
  declarations: [
    SynthesisListComponent
  ],
  exports: [
    SynthesisListComponent
  ]
})

export class SynthesisListModule {}
