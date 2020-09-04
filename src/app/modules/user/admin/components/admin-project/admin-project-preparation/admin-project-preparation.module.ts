import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {AdminProjectPreparationComponent} from './admin-project-preparation.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    AdminProjectPreparationComponent
  ],
  exports: [
    AdminProjectPreparationComponent
  ]
})

export class AdminProjectPreparationModule {}
