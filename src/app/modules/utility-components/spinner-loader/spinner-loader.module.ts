import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SpinnerLoaderComponent } from './spinner-loader.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    SpinnerLoaderComponent
  ],
  exports: [
    SpinnerLoaderComponent
  ],
  providers: [
  ]
})

export class SpinnerLoaderModule {}
