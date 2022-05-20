import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignProsComponent} from './admin-campaign-pros.component';
import {SharedProfessionalsListModule} from '../../../../../shared/components/shared-professionals-list/shared-professionals-list.module';
import {SidebarUserFormModule} from '../../../../../sidebars/components/user-form/sidebar-user-form.module';
import {AutoCompleteInputModule} from '../../../../../utility/auto-complete-input/auto-complete-input.module';
import {FormsModule} from '@angular/forms';
import {AdminStatsBannerModule} from '../../admin-stats-banner/admin-stats-banner.module';
import {ModalModule, SidebarFullModule} from '@umius/umi-common-component';
import {SharedCsvErrorModule} from '../../../../../shared/components/shared-csv-error/shared-csv-error.module';

@NgModule({
    imports: [
        CommonModule,
        SharedProfessionalsListModule,
        SidebarUserFormModule,
        AutoCompleteInputModule,
        FormsModule,
        AdminStatsBannerModule,
        SidebarFullModule,
        ModalModule,
        SharedCsvErrorModule,
    ],
  declarations: [
    AdminCampaignProsComponent
  ]
})

export class AdminCampaignProsModule {}
