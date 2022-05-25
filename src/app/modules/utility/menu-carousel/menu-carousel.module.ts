import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCarouselComponent } from './menu-carousel.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [MenuCarouselComponent],
  exports: [MenuCarouselComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class MenuCarouselModule { }
