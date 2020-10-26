import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommentListComponent} from './comment-list.component';
import {CommentCardModule} from '../comment-card/comment-card.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [CommentListComponent],
  exports: [
    CommentListComponent
  ],
  imports: [
    CommonModule,
    CommentCardModule,
    TranslateModule
  ]
})
export class CommentListModule {
}
