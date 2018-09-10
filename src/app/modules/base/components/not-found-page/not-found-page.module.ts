import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NotFoundPageComponent } from './not-found-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule
  ],
  declarations: [
    NotFoundPageComponent
  ],
  exports: [
    NotFoundPageComponent
  ]
})

export class NotFoundPageModule {}
