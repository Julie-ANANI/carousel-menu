import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { LogoutPageComponent } from './components/logout-page/logout-page.component';
import { ForgetPasswordPageComponent } from './components/forget-password-page/forget-password-page.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

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
    LogoutPageComponent,
    ForgetPasswordPageComponent,
    SignupPageComponent,
    FooterComponent,
    HeaderComponent,
    WelcomePageComponent,
    NotFoundPageComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})

export class BaseModule {}
