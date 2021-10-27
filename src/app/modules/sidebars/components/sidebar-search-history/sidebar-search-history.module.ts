import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarSearchHistoryComponent } from './sidebar-search-history.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
import { CountryFlagModule } from '../../../utility/country-flag/country-flag.module';
import { TableComponentsModule } from '@umius/umi-common-component/table';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SidebarModule,
        CountryFlagModule,
        TableComponentsModule
    ],
  declarations: [
   SidebarSearchHistoryComponent
  ],
  exports: [
    SidebarSearchHistoryComponent
  ]
})

export class SidebarSearchHistoryModule {}
