import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { WelcomePageComponent } from './welcome-page.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    FormsModule
  ],
  declarations: [
    WelcomePageComponent
  ],
  exports: [
    WelcomePageComponent
  ]
})

export class WelcomePageModule {}
