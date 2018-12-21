import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderUnauthComponent } from './header-unauth.component';

import { SidebarModule}  from '../../sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
  ],
  declarations: [
    HeaderUnauthComponent
  ],
  exports: [
    HeaderUnauthComponent
  ]
})

export class HeaderUnauthModule {}
