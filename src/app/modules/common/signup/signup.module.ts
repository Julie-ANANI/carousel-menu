import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from "./signup.component";
import { SignupRoutingModule } from "./signup-routing.module";
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user/user.service';
import { SidebarModule } from '../../sidebar/sidebar.module';
import { SidebarSignupFormModule } from '../../sidebar/components/signup-form/sidebar-signup-form.module';
import { AutocompleteService } from '../../../services/autocomplete/autocomplete.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SignupRoutingModule,
    SidebarModule,
    SidebarSignupFormModule
  ],
  declarations: [
    SignupComponent
  ],
  providers: [
    UserService,
    AutocompleteService
  ]
})

export class SignupModule {}
