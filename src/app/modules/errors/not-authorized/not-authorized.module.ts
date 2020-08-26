import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { NotAuthorizedComponent } from './not-authorized.component';
import { NotAuthorizedRoutingModule } from './not-authorized-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    NotAuthorizedRoutingModule
  ],
  declarations: [
    NotAuthorizedComponent
  ],
  exports: [
    NotAuthorizedComponent
  ]
})

export class NotAuthorizedModule {}
