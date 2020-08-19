import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { NotAuthorizedComponent } from './not-authorized.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule
  ],
  declarations: [
    NotAuthorizedComponent
  ],
  exports: [
    NotAuthorizedComponent
  ]
})

export class NotAuthorizedModule {}
