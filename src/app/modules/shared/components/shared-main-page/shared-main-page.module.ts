import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedMainPageComponent } from './shared-main-page.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    SharedMainPageComponent
  ],
  exports: [
    SharedMainPageComponent
  ]
})

export class SharedMainPageModule {}
