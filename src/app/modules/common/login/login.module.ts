import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

import { LoginRoutingModule } from './login-routing.module';
import { ResetPasswordModule } from './components/reset-password/reset-password.module';
import { SpinnerLoaderModule } from '../../utility/spinner-loader/spinner-loader.module';
import { ModalModule } from '../../utility/modals/modal/modal.module';
// import { UmiusCommonComponentsModule } from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ResetPasswordModule,
    SpinnerLoaderModule,
    ModalModule,
    // UmiusCommonComponentsModule,
  ],
  declarations: [LoginComponent],
})
export class LoginModule {
}
