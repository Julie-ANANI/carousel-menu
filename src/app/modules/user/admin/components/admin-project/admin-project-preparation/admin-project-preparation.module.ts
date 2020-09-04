import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {AdminProjectPreparationComponent} from './admin-project-preparation.component';
import {ModalEmptyModule} from '../../../../../utility/modals/modal-empty/modal-empty.module';
import {AdminProjectCampaignsModule} from '../admin-project-campaigns/admin-project-campaigns.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ModalEmptyModule,
    AdminProjectCampaignsModule
  ],
  declarations: [
    AdminProjectPreparationComponent
  ],
  exports: [
    AdminProjectPreparationComponent
  ]
})

export class AdminProjectPreparationModule {}
