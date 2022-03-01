import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminProjectCollectionComponent} from './admin-project-collection.component';

import {AdminStatsBannerModule} from '../../admin-stats-banner/admin-stats-banner.module';
import {SidebarUserAnswerModule} from '../../../../../sidebars/components/sidebar-user-answer/sidebar-user-answer.module';
import {TranslateModule} from "@ngx-translate/core";
import {SharedCsvErrorModule} from "../../../../../shared/components/shared-csv-error/shared-csv-error.module";
import { SharedImportAnswersModule } from "../../../../../shared/components/shared-import-answers/shared-import-answers.module";
import {ModalModule, SidebarFullModule, TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    AdminStatsBannerModule,
    SidebarUserAnswerModule,
    TranslateModule,
    SharedCsvErrorModule,
    SharedImportAnswersModule,
    ModalModule,
    TableModule,
    SidebarFullModule,
  ],
  declarations: [
    AdminProjectCollectionComponent
  ],
  exports: [
    AdminProjectCollectionComponent
  ]
})

export class AdminProjectCollectionModule { }
