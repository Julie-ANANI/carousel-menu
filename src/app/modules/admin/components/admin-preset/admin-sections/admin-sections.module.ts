import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminSectionsComponent } from './admin-sections.component';
import { AdminSectionsEditComponent } from './admin-sections-edit/admin-sections-edit.component';
import { AdminSectionsListComponent } from './admin-sections-list/admin-sections-list.component';
import { AdminSectionsNewComponent } from './admin-sections-new/admin-sections-new.component';
import { SharedSortModule} from '../../../../shared/components/shared-sort/sort.module';
import { SharedPaginationModule } from '../../../../shared/components/shared-pagination/pagination.module';
import { SharedFilterInputModule } from '../../../../shared/components/shared-filter-input/filter-input.module';
import { SharedModule } from '../../../../shared/shared.module';
import {AutocompleteInputModule} from '../../../../../directives/autocomplete-input/autocomplete-input.module';
import { GlobalModule } from "../../../../global/global.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedSortModule,
    SharedPaginationModule,
    SharedFilterInputModule,
    TranslateModule.forChild(),
    AutocompleteInputModule
    GlobalModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminSectionsComponent,
    AdminSectionsEditComponent,
    AdminSectionsListComponent,
    AdminSectionsNewComponent
  ],
  exports: [
    AdminSectionsComponent
  ]
})

export class AdminSectionsModule {}
