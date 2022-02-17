import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedSearchProsComponent } from './shared-search-pros.component';

import { SidebarSearchModule } from '../../../sidebars/components/sidebar-search/sidebar-search.module';
import { SharedSearchSettingsModule } from '../shared-search-settings/shared-search-settings.module';
import { SharedTargetingWorldModule } from '../shared-targeting-world/shared-targeting-world.module';
import { SharedSearchConfigProModule } from '../shared-search-config-pro/shared-search-config-pro.module';
import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';
import { SharedProfessionalTargetingModule } from '../shared-professional-targeting/shared-professional-targeting.module';
import {ModalModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarSearchModule,
    SharedSearchSettingsModule,
    SharedTargetingWorldModule,
    SharedSearchConfigProModule,
    MessageTemplateModule,
    SharedProfessionalTargetingModule,
    ModalModule
  ],
  declarations: [
    SharedSearchProsComponent
  ],
  exports: [
    SharedSearchProsComponent
  ]
})

export class SharedSearchProsModule { }
