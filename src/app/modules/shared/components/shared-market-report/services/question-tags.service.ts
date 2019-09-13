import { Injectable } from '@angular/core';
import { Tag } from '../../../../../models/tag';

@Injectable()
export class QuestionTagsService {

  public answersTagsLists: {[questionId: string]: Array<Tag>} = {};

}
