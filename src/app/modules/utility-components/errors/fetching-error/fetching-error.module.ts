import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { FetchingErrorComponent } from './fetching-error.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    FetchingErrorComponent
  ],
  exports: [
    FetchingErrorComponent
  ]
})

export class FetchingErrorModule {}
