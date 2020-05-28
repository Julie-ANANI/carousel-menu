import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BannerComponent } from './banner.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    BannerComponent
  ],
  exports: [
    BannerComponent
  ]
})

export class BannerModule {}
