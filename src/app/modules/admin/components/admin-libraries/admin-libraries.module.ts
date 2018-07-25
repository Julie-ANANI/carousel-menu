import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { PipeModule } from '../../../../pipe/pipe.module';
import { SharedSortModule } from '../../../shared/components/shared-sort/shared-sort.module';
import { AdminLibrariesComponent } from "./admin-libraries.component";
import { AdminWorkflowsLibraryModule } from "./admin-workflows-library/admin-workflows-library.module";
import { AdminSignaturesLibraryModule } from "./admin-signatures-library/admin-signatures-library.module";
import { RouterModule } from "@angular/router";
import {AdminPresetsModule} from './admin-preset/admin-presets/admin-presets.module';

@NgModule({
  imports: [
    CommonModule,
    SharedSortModule,
    RouterModule,
    TranslateModule.forChild(),
    Ng2AutoCompleteModule,
    PipeModule,
    AdminWorkflowsLibraryModule,
    AdminSignaturesLibraryModule,
    AdminPresetsModule

  ],
  declarations: [
    AdminLibrariesComponent
  ],
  exports: [
    AdminLibrariesComponent
  ]
})

export class AdminLibrariesModule {}
