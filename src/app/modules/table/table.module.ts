import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { TableComponent } from './components/table.component';

import { SharedSearchMultiModule } from '../shared/components/shared-search-multi/shared-search-multi.module';
import { SharedSortModule } from '../shared/components/shared-sort/shared-sort.module';
import { ProgressBarModule } from '../utility/progress-bar/progress-bar.module';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';
import { CountryFlagModule } from '../utility/country-flag/country-flag.module';
import { PipeModule } from '../../pipe/pipe.module';
import { MessageTemplateModule } from '../utility/messages/message-template/message-template.module';
import { PaginationTemplate2Module } from '../utility/paginations/pagination-template-2/pagination-template-2.module';
import {ModalEmptyModule} from '../utility/modals/modal-empty/modal-empty.module';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedSearchMultiModule,
        SharedSortModule,
        FormsModule,
        TranslateModule.forChild(),
        PipeModule,
        ProgressBarModule,
        SharedLoaderModule,
        CountryFlagModule,
        MessageTemplateModule,
        PaginationTemplate2Module,
        ModalEmptyModule,
        RouterModule
    ],
  declarations: [
    TableComponent
  ],
  exports: [
    TableComponent,
  ]
})

export class TableModule { }
