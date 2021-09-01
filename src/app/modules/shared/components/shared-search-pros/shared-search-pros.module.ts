import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedSearchProsComponent } from './shared-search-pros.component';

import { SidebarModule } from '../../../sidebars/templates/sidebar/sidebar.module';
import { SidebarSearchModule } from '../../../sidebars/components/sidebar-search/sidebar-search.module';
import { ModalModule } from "../../../utility/modals/modal/modal.module";
import { SharedSearchSettingsModule } from '../shared-search-settings/shared-search-settings.module';
import { SharedTargetingWorldModule } from '../shared-targeting-world/shared-targeting-world.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SidebarModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarSearchModule,
    ModalModule,
    SharedSearchSettingsModule,
    SharedTargetingWorldModule
  ],
  declarations: [
    SharedSearchProsComponent
  ],
  exports: [
    SharedSearchProsComponent
  ]
})

export class SharedSearchProsModule { }
