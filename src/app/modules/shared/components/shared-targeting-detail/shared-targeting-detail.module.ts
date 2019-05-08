import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedTargetingDetailComponent } from './shared-targeting-detail.component';

import { SharedWorldmapModule } from '../shared-worldmap/shared-worldmap.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SharedWorldmapModule
  ],
  declarations: [
    SharedTargetingDetailComponent
  ],
  exports: [
    SharedTargetingDetailComponent
  ]
})

export class SharedTargetingDetailModule {}
