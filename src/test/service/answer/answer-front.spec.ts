import { AnswerFrontService } from "../../../app/services/answer/answer-front.service";
import { Answer } from "../../../app/models/answer";
import { Tag } from "../../../app/models/tag";

describe('Service - AnswerFrontService', () => {

  describe('#qualitySort', ()=>{
    it('input = null || [], return empty list', () => {
      expect(AnswerFrontService.qualitySort(null).length).toBe(0);

      expect(AnswerFrontService.qualitySort([]).length).toBe(0);
    });

    it('input = [answers],  return sorted list', () => {
      let answers: Array<Answer> = []
      for (let i = 0; i < 10; i++) {
        const answer: Answer = {
          meta: undefined,
          tags: undefined,
          status: undefined,
          innovation: "",
          job: "",
          used_language: "",
          _tags: undefined,
          answerTags: {},
          answeredByEmail: false,
          answers: undefined,
          answers_translations: undefined,
          campaign: undefined,
          company: undefined,
          country: null,
          profileQuality: i + 10,
        }
        answers.push(answer);
      }
      answers = AnswerFrontService.qualitySort(answers);
      expect(answers[0].profileQuality).toBe(19);
      expect(answers[9].profileQuality).toBe(10);
    })

  })

  describe('#tagsOccurrence', () => {
    let input: Array<Answer> = [];
    let answer_1: Answer = <Answer>{
      meta: undefined,
      tags: [],
      status: undefined,
      innovation: "",
      job: "",
      used_language: "",
      _tags: [],
      answerTags: {},
      answeredByEmail: false,
      answers: undefined,
      answers_translations: undefined,
      campaign: undefined,
      company: undefined,
      country: null,
    };
    let answer_2: Answer = <Answer>{
      meta: undefined,
      tags: [],
      status: undefined,
      innovation: "",
      job: "",
      used_language: "",
      _tags: [],
      answerTags: {},
      answeredByEmail: false,
      answers: undefined,
      answers_translations: undefined,
      campaign: undefined,
      company: undefined,
      country: null,
    };
    let tag_1: Tag = <Tag>{
      _id: '1',
      label: null
    };
    let tag_2: Tag = <Tag>{
      _id: '2',
      label: null
    };

    it('input = empty list, output = empty list', () => {
      expect(AnswerFrontService.tagsOccurrence(null).length).toBe(0);
      expect(AnswerFrontService.tagsOccurrence(input).length).toBe(0);
    })

    it('input = empty tags list, should return empty list', () => {
      input.push(answer_1);
      const results = AnswerFrontService.tagsOccurrence(input);
      expect(results.length).toBe(0);
    })

    it('input = one _id in tags, return list.length =1, count=3', () => {
      answer_1.tags.push(tag_1);
      answer_1.tags.push(tag_1);
      answer_1.tags.push(tag_1);
      input = [answer_1];
      const results = AnswerFrontService.tagsOccurrence(input);
      expect(results.length).toBe(1);
      expect(results[0].count).toBe(3);
    })

    it('input = 2 _ids in tags, return list.length =2, sorted list', () => {
      answer_2.tags = [];
      answer_1.tags = [];
      answer_2.tags.push(tag_2);
      answer_2.tags.push(tag_1);
      answer_2.tags.push(tag_2);
      answer_1.tags.push(tag_1);
      answer_1.tags.push(tag_2);
      answer_1.tags.push(tag_2);
      input = [];
      input = input.concat([answer_1, answer_2]);
      const results = AnswerFrontService.tagsOccurrence(input);
      expect(results.length).toBe(2);
      expect(results[0].count).toBe(4);
      expect(results[1].count).toBe(2);
    })
  })


});
