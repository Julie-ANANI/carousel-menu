import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CampaignFormComponent } from './campaign-form.component';

import { SidebarModule } from '../../sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
  ],
  declarations: [
    CampaignFormComponent
  ],
  exports: [
    CampaignFormComponent
  ]
})

export class SidebarCampaignFormModule {}
