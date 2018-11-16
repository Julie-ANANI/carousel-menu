import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NotFoundPageComponent } from './not-found-page.component';
import { RouterModule } from '@angular/router';
import { FooterModule } from "../footer/footer.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    FooterModule
  ],
  declarations: [
    NotFoundPageComponent
  ],
  exports: [
    NotFoundPageComponent
  ]
})

export class NotFoundModule {}
