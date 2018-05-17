import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedWorldmapComponent } from './shared-worldmap.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedWorldmapComponent
  ],
  exports: [
    SharedWorldmapComponent
  ]
})

export class SharedWorldmapModule {}
