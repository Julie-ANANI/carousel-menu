import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from "./signup.component";
import { SignupRoutingModule } from "./signup-routing.module";
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user/user.service';
import { SidebarModule } from '../../sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SignupRoutingModule,
    SidebarModule
  ],
  declarations: [
    SignupComponent
  ],
  providers: [
    UserService
  ]
})

export class SignupModule {}
