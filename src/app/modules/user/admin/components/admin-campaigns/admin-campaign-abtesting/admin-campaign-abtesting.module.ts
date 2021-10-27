import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignAbtestingComponent} from './admin-campaign-abtesting.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import { TableComponentsModule } from '@umius/umi-common-component/table';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        TableComponentsModule
    ],
  declarations: [
    AdminCampaignAbtestingComponent
  ]
})

export class AdminCampaignAbtestingModule {}
