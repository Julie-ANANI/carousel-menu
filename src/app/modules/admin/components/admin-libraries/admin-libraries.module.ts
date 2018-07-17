import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { GlobalModule } from "../../../global/global.module";
import { MultilingModule } from '../../../../pipes/multiling/multiling.module';
import { SharedSortModule } from '../../../shared/components/shared-sort/sort.module';
import { AdminLibrariesComponent } from "./admin-libraries.component";
import { AdminWorkflowsLibraryModule } from "./admin-workflows-library/admin-workflows-library.module";
import { AdminSignaturesLibraryModule } from "./admin-signatures-library/admin-signatures-library.module";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    SharedSortModule,
    RouterModule,
    GlobalModule,
    TranslateModule.forChild(),
    Ng2AutoCompleteModule,
    MultilingModule,
    AdminWorkflowsLibraryModule,
    AdminSignaturesLibraryModule
  ],
  declarations: [
    AdminLibrariesComponent
  ],
  exports: [
    AdminLibrariesComponent
  ]
})

export class AdminLibrariesModule {}
