import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {UserPipe} from './user.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    UserPipe,
  ],
  exports: [
    UserPipe
  ]
})

export class UserPipeModule {}
