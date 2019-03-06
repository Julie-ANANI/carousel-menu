import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProsListModule } from '../../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { PipeModule } from '../../../../../../pipe/pipe.module';
import { AdminCommunitySearchComponent } from "./admin-community-search.component";



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    PipeModule
  ],
  declarations: [
    AdminCommunitySearchComponent
  ],
  exports: [
    AdminCommunitySearchComponent
  ]
})

export class AdminCommunitySearchModule { }
