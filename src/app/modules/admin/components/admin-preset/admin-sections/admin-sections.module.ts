import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSortModule} from '../../../../shared/components/shared-sort/shared-sort.module';
import { SharedPaginationModule } from '../../../../shared/components/shared-pagination/shared-pagination.module';
import { SharedFilterInputModule } from '../../../../shared/components/shared-filter-input/shared-filter-input.module';
import { SharedLoaderModule } from '../../../../shared/components/shared-loader/shared-loader.module';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { InputModule } from '../../../../input/input.module';
import { AdminSectionsComponent } from './admin-sections.component';
import { AdminSectionsEditComponent } from './admin-sections-edit/admin-sections-edit.component';
import { AdminSectionsListComponent } from './admin-sections-list/admin-sections-list.component';
import { AdminSectionsNewComponent } from './admin-sections-new/admin-sections-new.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedSortModule,
    SharedPaginationModule,
    SharedFilterInputModule,
    TranslateModule.forChild(),
    TranslateModule.forChild(),
    SharedLoaderModule,
    PipeModule,
    InputModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
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
