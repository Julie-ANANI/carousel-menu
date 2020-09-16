import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminProjectCollectionComponent} from './admin-project-collection.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AdminProjectCollectionComponent
  ],
  exports: [
    AdminProjectCollectionComponent
  ]
})

export class AdminProjectCollectionModule { }
