import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProfessionalsListComponent } from './shared-professionals-list.component';

import { TableModule } from '../../../table/table.module';
import { SidebarModule } from '../../../sidebars/templates/sidebar/sidebar.module';
import { SidebarUserFormModule } from '../../../sidebars/components/user-form/sidebar-user-form.module';
import { SidebarTagsModule } from '../../../sidebars/components/sidebar-tags/sidebar-tags.module';
import { ModalModule } from '../../../utility/modals/modal/modal.module';
import {SidebarSearchModule} from '../../../sidebars/components/sidebar-search/sidebar-search.module';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedWorldListModule} from '../shared-world-list/shared-world-list.module';
import {SharedTargetingWorldModule} from '../shared-targeting-world/shared-targeting-world.module';
import { TableComponentsModule } from '@umius/umi-common-component/table';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TableModule,
    SidebarModule,
    SidebarUserFormModule,
    SidebarTagsModule,
    ModalModule,
    SidebarSearchModule,
    SharedWorldListModule,
    SharedTargetingWorldModule,
    TableComponentsModule,
  ],
  declarations: [SharedProfessionalsListComponent],
  exports: [SharedProfessionalsListComponent],
})
export class SharedProfessionalsListModule {}
