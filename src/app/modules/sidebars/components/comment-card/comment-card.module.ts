import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentCardComponent } from './comment-card.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [CommentCardComponent],
  exports: [
    CommentCardComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
  ],
})
export class CommentCardModule { }
