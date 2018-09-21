// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedCarouselComponent } from './shared-carousel.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedCarouselComponent
  ],
  exports: [
    SharedCarouselComponent
  ]
})

export class SharedCarouselModule { }
