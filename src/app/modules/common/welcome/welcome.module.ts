import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';

import { UserService } from '../../../services/user/user.service';


@NgModule({
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    TranslateModule.forChild(),
    FormsModule
  ],
  declarations: [
    WelcomeComponent
  ],
  providers: [
    UserService
  ],
  exports: [
    WelcomeComponent
  ]
})

export class WelcomeModule {}
