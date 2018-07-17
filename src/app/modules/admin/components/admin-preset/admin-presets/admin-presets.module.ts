import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminPresetsComponent } from './admin-presets.component';
import { AdminPresetsEditComponent } from './admin-presets-edit/admin-presets-edit.component';
import { AdminPresetsListComponent } from './admin-presets-list/admin-presets-list.component';
import { AdminPresetsNewComponent } from './admin-presets-new/admin-presets-new.component';
import { SharedFilterInputModule } from '../../../../shared/components/shared-filter-input/filter-input.module';
import { SharedModule } from '../../../../shared/shared.module';
import { AutocompleteInputModule } from '../../../../../directives/autocomplete-input/autocomplete-input.module';
import { SharedSortModule} from '../../../../shared/components/shared-sort/sort.module';
import { SharedPaginationModule } from '../../../../shared/components/shared-pagination/pagination.module';
import { GlobalModule } from '../../../../global/global.module';
import { SharedLoaderModule } from '../../../../shared/components/shared-loader/shared-loader.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GlobalModule,
    TranslateModule.forChild(),
    SharedFilterInputModule,
    SharedSortModule,
    SharedPaginationModule,
    TranslateModule.forChild(),
    AutocompleteInputModule,
    SharedLoaderModule
  ],
  declarations: [
    AdminPresetsComponent,
    AdminPresetsEditComponent,
    AdminPresetsListComponent,
    AdminPresetsNewComponent
  ],
  exports: [
    AdminPresetsComponent
  ]
})

export class AdminPresetsModule {}
