import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import {AdminProjectFollowUpComponent} from './admin-project-follow-up.component';

import {SharedFollowUpModule} from '../../../../../shared/components/shared-follow-up/shared-follow-up.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    SharedFollowUpModule
  ],
  declarations: [
    AdminProjectFollowUpComponent
  ],
  exports: [
    AdminProjectFollowUpComponent
  ]
})

export class AdminProjectFollowUpModule {}
