import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {SidebarSearchComponent} from './sidebar-search.component';

import { SidebarModule } from '../../sidebar.module';
import { CountryFlagModule } from '../../../utility-components/country-flag/country-flag.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    CountryFlagModule
  ],
  declarations: [
   SidebarSearchComponent
  ],
  exports: [
    SidebarSearchComponent
  ]
})

export class SidebarSearchModule {}
