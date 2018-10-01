import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SynthesisListComponent } from './synthesis-list.component';
import { RouterModule } from '@angular/router';

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
