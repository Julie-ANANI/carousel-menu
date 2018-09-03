import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LogoutPageComponent } from './logout-page.component';
import { SharedLoaderModule } from '../../../shared/components/shared-loader/shared-loader.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SharedLoaderModule
  ],
  declarations: [
    LogoutPageComponent
  ],
  exports: [
    LogoutPageComponent
  ]
})

export class LogoutPageModule {}
