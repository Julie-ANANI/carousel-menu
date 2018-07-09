import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedRatingItemComponent } from './shared-rating-item.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    SharedRatingItemComponent
  ],
  exports: [
    SharedRatingItemComponent
  ]
})

export class SharedRatingItemModule{ }
