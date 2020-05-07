import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CarouselComponent } from './carousel.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    CarouselComponent
  ],
  exports: [
    CarouselComponent
  ],
  providers: [
  ]
})

export class CarouselModule {}
