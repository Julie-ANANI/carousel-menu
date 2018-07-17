/* Module */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';
import { SidebarModule } from '../shared/components/shared-sidebar/sidebar.module';

/* Components */
import { FooterComponent } from './component/footer/footer.component';
import { HeaderComponent } from './component/header/header.component';
import { LoginPageComponent } from './component/login-page/login-page.component';
import { LogoutPageComponent } from './component/logout-page/logout-page.component';
import { SignupPageComponent } from './component/signup-page/signup-page.component';
import { ForgetPasswordPageComponent } from './component/forget-password-page/forget-password-page.component';
import { WelcomePageComponent } from './component/welcome-page/welcome-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    SharedLoaderModule,
    SidebarModule
  ],
  declarations: [
    LoginPageComponent,
    LogoutPageComponent,
    ForgetPasswordPageComponent,
    SignupPageComponent,
    FooterComponent,
    HeaderComponent,
    WelcomePageComponent
  ],
  exports: [
    FooterComponent,
    HeaderComponent
  ]
})

export class BaseModule {}
