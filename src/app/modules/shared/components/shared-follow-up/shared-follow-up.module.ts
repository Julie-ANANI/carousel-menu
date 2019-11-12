import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedFollowUpComponent } from './shared-follow-up.component';

import { Sidebar2Module } from '../../../sidebars/templates/sidebar2/sidebar2.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    Sidebar2Module
  ],
  declarations: [
    SharedFollowUpComponent
  ],
  exports: [
    SharedFollowUpComponent
  ]
})

export class SharedFollowUpModule {}
