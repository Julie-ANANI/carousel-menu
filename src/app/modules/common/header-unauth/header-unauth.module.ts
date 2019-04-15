import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderUnauthComponent } from './header-unauth.component';

import { UserService } from '../../../services/user/user.service';
import { AutocompleteService } from '../../../services/autocomplete/autocomplete.service';

import { SidebarModule}  from '../../sidebar/sidebar.module';
import { SidebarSignupFormModule } from '../../sidebar/components/signup-form/sidebar-signup-form.module';
import { ModalModule } from '../../utility-components/modals/modal/modal.module';


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
  providers: [
    UserService,
    AutocompleteService
  ],
  exports: [
    HeaderUnauthComponent
  ]
})

export class HeaderUnauthModule {}
