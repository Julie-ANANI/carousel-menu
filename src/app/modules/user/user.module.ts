import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';

// import { UserService } from '../../services/user/user.service';

import { UserComponent } from './user.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    UserRoutingModule
  ],
  declarations: [
    UserComponent,
  ],
  providers: [
  ]
})

export class UserModule {}
