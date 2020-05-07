import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {SidebarSearchComponent} from './sidebar-search.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
import { CountryFlagModule } from '../../../utility/country-flag/country-flag.module';
import { SharedTargetingWorldModule } from "../../../shared/components/shared-targeting-world/shared-targeting-world.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    CountryFlagModule,
    SharedTargetingWorldModule
  ],
  declarations: [
   SidebarSearchComponent
  ],
  exports: [
    SidebarSearchComponent
  ]
})

export class SidebarSearchModule {}
