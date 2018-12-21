import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShareRoutingModule } from './share-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ShareComponent } from './share.component';

import { SynthesisListModule } from '../../user/client/components/synthesis-list/synthesis-list.module';
import { SidebarModule } from '../../sidebar/sidebar.module';
import { SidebarUserFormModule } from '../../sidebar/components/user-form/sidebar-user-form.module';
import { HeaderModule } from '../../common/header/header.module';
import { HeaderUnauthModule } from '../../common/header-unauth/header-unauth.module';
import { SynthesisCompleteModule } from './component/synthesis-complete/synthesis-complete.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SynthesisCompleteModule,
    ShareRoutingModule,
    RouterModule,
    SynthesisListModule,
    SidebarModule,
    SidebarUserFormModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    HeaderUnauthModule
  ],
  declarations: [
    ShareComponent,
  ]
})

export class ShareModule {}
