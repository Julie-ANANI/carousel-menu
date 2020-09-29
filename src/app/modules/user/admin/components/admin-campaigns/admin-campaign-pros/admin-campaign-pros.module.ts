import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminCampaignProsComponent} from './admin-campaign-pros.component';
import {SharedProfessionalsListModule} from '../../../../../shared/components/shared-professionals-list/shared-professionals-list.module';
import {SidebarModule} from '../../../../../sidebars/templates/sidebar/sidebar.module';
import {SidebarUserFormModule} from '../../../../../sidebars/components/user-form/sidebar-user-form.module';
import {ModalModule} from '../../../../../utility/modals/modal/modal.module';
import {AutoCompleteInputModule} from '../../../../../utility/auto-complete-input/auto-complete-input.module';

@NgModule({
  imports: [
    CommonModule,
    SharedProfessionalsListModule,
    SidebarModule,
    SidebarUserFormModule,
    ModalModule,
    AutoCompleteInputModule,
  ],
  declarations: [
    AdminCampaignProsComponent
  ]
})

export class AdminCampaignProsModule {}
