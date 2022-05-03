import { AnswerFrontService } from "../../../app/services/answer/answer-front.service";
import { Answer } from "../../../app/models/answer";
import { Tag } from "../../../app/models/tag";

describe('Service - AnswerFrontService', () => {
  let input: Array<Answer>;
  let answer_1: Answer;
  let answer_2: Answer;
  let tag_1: Tag;
  let tag_2: Tag;

  beforeEach(() => {
    input = [];
    answer_1 = <Answer>{
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
      company: null,
      country: null,
      professional: null,
    };
    answer_2 = <Answer>{
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
    tag_1 = <Tag>{
      _id: '1',
      label: null
    };
    tag_2 = <Tag>{
      _id: '2',
      label: null
    };
  })

  afterAll(() => {
    input = [];
    answer_1.tags = [];
    answer_2.tags = [];
    answer_1.company = null;
    answer_1.professional = null;
  })

  describe('#qualitySort', () => {
    test('input = null || [], return empty list', () => {
      expect(AnswerFrontService.qualitySort(null).length).toBe(0);

      expect(AnswerFrontService.qualitySort([]).length).toBe(0);
    });

    test('input = [answers],  return sorted list', () => {
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
        input.push(answer);
      }
      input = AnswerFrontService.qualitySort(input);
      expect(input[0].profileQuality).toBe(19);
      expect(input[9].profileQuality).toBe(10);
    })

  })

  describe('#tagsOccurrence', () => {

    test('input = empty list, output = empty list', () => {
      expect(AnswerFrontService.tagsOccurrence(null).length).toBe(0);
      expect(AnswerFrontService.tagsOccurrence(input).length).toBe(0);
    })

    test('input = empty tags list, should return empty list', () => {
      input.push(answer_1);
      const results = AnswerFrontService.tagsOccurrence(input);
      expect(results.length).toBe(0);
    })

    test('input = one _id in tags, return list.length =1, count=3', () => {
      answer_1.tags.push(tag_1);
      answer_1.tags.push(tag_1);
      answer_1.tags.push(tag_1);
      input = [answer_1];
      const results = AnswerFrontService.tagsOccurrence(input);
      expect(results.length).toBe(1);
      expect(results[0].count).toBe(3);
    })

    test('input = 2 _ids in tags, return list.length =2, sorted list', () => {
      answer_2.tags.push(tag_2);
      answer_2.tags.push(tag_1);
      answer_2.tags.push(tag_2);
      answer_1.tags.push(tag_1);
      answer_1.tags.push(tag_2);
      answer_1.tags.push(tag_2);
      input = input.concat([answer_1, answer_2]);
      const results = AnswerFrontService.tagsOccurrence(input);
      expect(results.length).toBe(2);
      expect(results[0].count).toBe(4);
      expect(results[1].count).toBe(2);
    })
  })

  describe('#anonymous', () => {
    test('input=null || [], return []', () => {
      expect(AnswerFrontService.anonymous(null).length).toBe(0);
      expect(AnswerFrontService.anonymous([]).length).toBe(0);
    })

    test('input: company = null', () => {
      input.push(answer_1);
      const results = AnswerFrontService.anonymous(input);
      expect(results.length).toBe(1);
      expect(results[0]['company']['name']).toBe('');
    })

    test('input: professional = null', () => {
      input.push(answer_1);
      const results = AnswerFrontService.anonymous(input);
      expect(results.length).toBe(1);
      expect(typeof results[0]['professional']).toBe('object');
      expect(results[0]['professional']['language']).toBe('en');
      expect(results[0]['professional']['company']).toBe(undefined);
    })

    test('input: company has a real name', () => {
      answer_1.company = {
        name: 'umi'
      };
      input.push(answer_1);
      const results = AnswerFrontService.anonymous(input);
      expect(results.length).toBe(1);
      expect(results[0]['company']['name']).toBe('');
    })

    test('input: professional has company', ()=>{
      answer_1.professional = {
        email: "",
        firstName: "",
        lastName: "",
        company: {
          name: 'umi'
        }
      };
      input.push(answer_1);
      const results = AnswerFrontService.anonymous(input);
      expect(results.length).toBe(1);
      expect(typeof results[0]['professional']).toBe('object');
      expect(results[0]['professional']['language']).toBe('en');
      expect(typeof results[0]['professional']['company']).toBe('object');
      expect(results[0]['professional']['company']['name']).toBe('');
    })
  })

});
