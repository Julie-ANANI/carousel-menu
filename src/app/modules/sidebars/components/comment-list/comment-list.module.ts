import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommentListComponent} from './comment-list.component';
import {CommentCardModule} from '../comment-card/comment-card.module';
import {TranslateModule} from '@ngx-translate/core';
import {CleanHtmlModule} from '../../../../pipe/cleanHtml/cleanHtml.module';

@NgModule({
  declarations: [CommentListComponent],
  exports: [
    CommentListComponent
  ],
    imports: [
        CommonModule,
        CommentCardModule,
        TranslateModule,
        CleanHtmlModule
    ]
})
export class CommentListModule {
}
