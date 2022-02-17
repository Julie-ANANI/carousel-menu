import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarCampaignComponent } from './sidebar-campaign.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SidebarCampaignComponent
  ],
  exports: [
    SidebarCampaignComponent
  ]
})

export class SidebarCampaignModule {}
