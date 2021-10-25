import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignAbtestingComponent} from './admin-campaign-abtesting.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TableModule} from '../../../../../table/table.module';
import {TranslateModule} from '@ngx-translate/core';
import { TableComponentsModule } from '@umius/umi-common-component/table';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        TranslateModule.forChild(),
        TableComponentsModule
    ],
  declarations: [
    AdminCampaignAbtestingComponent
  ]
})

export class AdminCampaignAbtestingModule {}
