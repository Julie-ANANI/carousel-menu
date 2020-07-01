import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule
  ],
  declarations: [
    NotFoundComponent
  ],
  exports: [
    NotFoundComponent
  ]
})

export class NotFoundModule {}
