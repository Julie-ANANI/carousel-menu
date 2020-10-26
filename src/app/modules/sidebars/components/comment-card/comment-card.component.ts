import {AfterViewInit, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CollaborativeComment, Reply} from '../../../../models/collaborative-comment';
import {JsonUtils} from '../../../../utils/jsonUtils';
import {EtherpadService} from '../../../../services/etherpad/etherpad.service';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements AfterViewInit {

  @ViewChild('scrollFrame') scrollFrame: ElementRef;
  @ViewChildren('reply') replyElements: QueryList<any>;
  @Input() padId: string;
  @Input() comment: CollaborativeComment;
  public newComment: Reply = {commentId: '', author: '', name: '', text: '', timestamp: 0};
  public displayNewCommentSuggestion = false;
  public editingNewComment = false;
  private scrollContainer: any;

  constructor(private _etherpadService: EtherpadService) {
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.replyElements.changes.subscribe(_ => this.onItemElementsChanged());
    this.fetchRepliesOfComment();
  }

  fetchRepliesOfComment() {
    this.padId = 'test';
    this._etherpadService
      .getAllRepliesOfPad(this.padId).subscribe((result) => {
      this.comment.replies = JsonUtils.jsonToArray(result.replies).filter((reply: Reply) => reply.commentId === this.comment.id);
    });
  }

  // API METHODS

  // TODO show icon edit reply only if owner
  sendReply() {
    // TODO set author & name
    this.newComment = {
      author: 'a.NLE4gNB2xPCA25Cr',
      commentId: this.comment.id,
      name: 'Léa',
      text: this.newComment.text
    };

    this._etherpadService.addRepliesToComment(this.padId, [this.newComment]).subscribe((res: any) => {
        this.newComment.id = res.replyId;
        this.comment.replies.push(this.newComment);
        this.newComment = {commentId: '', author: '', name: '', text: '', timestamp: 0};
        this.displayNewCommentSuggestion = false;
      }
    );
  }

  // VALIDATE SUBMIT METHODS

  isNullOrBlank(s: string) {
    return !s || s.length === 0 || !s.trim();
  }

  canSubmitNewComment() {
    const canSubmitNewComment = !this.isNullOrBlank(this.newComment.text);
    const canSubmitSuggestion = !this.isNullOrBlank(this.newComment.changeTo) && !this.isNullOrBlank(this.newComment.changeFrom);
    return canSubmitNewComment && (!this.displayNewCommentSuggestion || canSubmitSuggestion);
  }

  // AUTO SCROLL METHODS

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
}
