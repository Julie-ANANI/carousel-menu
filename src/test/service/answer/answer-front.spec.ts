import { AnswerFrontService } from "../../../app/services/answer/answer-front.service";

describe('AnswerFrontService', () => {

  it('#qualitySort should return empty list', () => {
    expect(AnswerFrontService.qualitySort([]).length).toBe(0);
  });

});
