import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderUnauthComponent } from './header-unauth.component';
import { SidebarSignupFormModule } from '../../sidebars/components/sidebar-signup-form/sidebar-signup-form.module';
import {ModalModule, SidebarFullModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarFullModule,
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
