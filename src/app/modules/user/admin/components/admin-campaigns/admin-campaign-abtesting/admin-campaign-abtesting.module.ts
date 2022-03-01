import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignAbtestingComponent} from './admin-campaign-abtesting.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TableModule,
  ],
  declarations: [
    AdminCampaignAbtestingComponent
  ]
})

export class AdminCampaignAbtestingModule {}
