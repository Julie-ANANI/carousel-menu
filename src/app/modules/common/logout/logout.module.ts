import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LogoutComponent } from './logout.component';
import { LogoutRoutingModule } from './logout-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    LogoutRoutingModule
  ],
  declarations: [
    LogoutComponent
  ],
  exports: [
    LogoutComponent
  ]
})

export class LogoutModule {}
