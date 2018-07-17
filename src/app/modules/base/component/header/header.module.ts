// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';

// Components

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule
  ],
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ]
})

export class HeaderModule { }
