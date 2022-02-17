import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProfessionalsListComponent } from './shared-professionals-list.component';

import { SidebarUserFormModule } from '../../../sidebars/components/user-form/sidebar-user-form.module';
import { SidebarTagsModule } from '../../../sidebars/components/sidebar-tags/sidebar-tags.module';
import {SidebarSearchModule} from '../../../sidebars/components/sidebar-search/sidebar-search.module';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedWorldListModule} from '../shared-world-list/shared-world-list.module';
import {SharedTargetingWorldModule} from '../shared-targeting-world/shared-targeting-world.module';
import {ModalModule, SidebarFullModule, TableModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarUserFormModule,
    SidebarTagsModule,
    SidebarSearchModule,
    SharedWorldListModule,
    SharedTargetingWorldModule,
    TableModule,
    SidebarFullModule,
    ModalModule,
  ],
  declarations: [SharedProfessionalsListComponent],
  exports: [SharedProfessionalsListComponent],
})
export class SharedProfessionalsListModule {}
