import {Component, Input, OnInit} from '@angular/core';
import {CollaborativeComment} from '../../../../models/collaborative-comment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
})
export class CommentListComponent implements OnInit {

  @Input() collaborativesComments: CollaborativeComment[];
  @Input() padID: string;
  @Input() innovationId: string;

  constructor() {
  }

  ngOnInit() {
    this.collaborativesComments.sort((c1, c2) => {
      return c2.timestamp - c1.timestamp;
    });
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
