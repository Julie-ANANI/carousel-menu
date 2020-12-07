import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentCardComponent } from './comment-card.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {CleanHtmlModule} from '../../../../pipe/cleanHtml/cleanHtml.module';

@NgModule({
  declarations: [CommentCardComponent],
  exports: [
    CommentCardComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    CleanHtmlModule,
  ],
})
export class CommentCardModule { }
