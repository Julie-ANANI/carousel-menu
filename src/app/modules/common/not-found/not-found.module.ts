import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NotFoundComponent } from './not-found.component';
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
    NotFoundComponent
  ],
  exports: [
    NotFoundComponent
  ]
})

export class NotFoundModule {}
