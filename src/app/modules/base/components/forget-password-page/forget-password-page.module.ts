import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ForgetPasswordPageComponent } from './forget-password-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
  ],
  declarations: [
    ForgetPasswordPageComponent
  ],
  exports: [
    ForgetPasswordPageComponent
  ]
})

export class ForgetPasswordPageModule {}
