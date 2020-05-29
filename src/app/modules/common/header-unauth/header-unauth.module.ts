import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderUnauthComponent } from './header-unauth.component';

import { SidebarModule}  from '../../sidebars/templates/sidebar/sidebar.module';
import { SidebarSignupFormModule } from '../../sidebars/components/signup-form/sidebar-signup-form.module';
import { ModalModule } from '../../utility/modals/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    SidebarSignupFormModule,
    ModalModule
  ],
  declarations: [
    HeaderUnauthComponent
  ],
  exports: [
    HeaderUnauthComponent
  ]
})

export class HeaderUnauthModule {}
