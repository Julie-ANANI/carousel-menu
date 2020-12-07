import {Component, Input, OnInit} from '@angular/core';
import {CollaborativeComment} from '../../../../models/collaborative-comment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() collaborativesComments: CollaborativeComment[];
  @Input() padID: string;
  @Input() innovationId: string;

  constructor() {
  }

  ngOnInit() {
  }

  displayCommentThread(id: string) {
    const element = document.getElementById(id);
    if (!!element) {
      element.style.display = 'block';
      this.collaborativesComments
        .filter((comment) => comment.id !== id)
        .forEach((comment) => this.hideCommentThread(comment.id));
    }
  }

  hideCommentThread(id: string) {
    document.getElementById(id).style.display = 'none';
  }

}
