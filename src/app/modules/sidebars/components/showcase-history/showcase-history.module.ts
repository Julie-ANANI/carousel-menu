import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ShowcaseHistoryComponent } from './showcase-history.component';
import {TableModule} from '@umius/umi-common-component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    TableModule
  ],
  declarations: [
   ShowcaseHistoryComponent
  ],
  exports: [
    ShowcaseHistoryComponent
  ]
})

export class ShowcaseHistoryModule {}
