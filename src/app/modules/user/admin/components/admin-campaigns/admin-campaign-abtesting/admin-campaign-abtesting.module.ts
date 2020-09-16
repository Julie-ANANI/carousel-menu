import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignAbtestingComponent} from './admin-campaign-abtesting.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TableModule} from '../../../../../table/table.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminCampaignAbtestingComponent
  ]
})

export class AdminCampaignAbtestingModule {}
