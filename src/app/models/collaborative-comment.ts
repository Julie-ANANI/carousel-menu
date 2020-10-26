export interface Comment {
  id?: string;
  text: string;
  changeTo?: string;
  changeFrom?: string;
  author: string;
  name: string;
  timestamp?: number;
}

export interface Reply extends Comment {
  commentId: string;
}

export interface CollaborativeComment extends Comment {
  replies: Reply[];
}
