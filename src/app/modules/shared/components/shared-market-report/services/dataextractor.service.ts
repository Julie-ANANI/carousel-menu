import {ReportData} from "../models/report-data.model";

const templateMapping = {
  "radio": "typeB1",
  "stars": "typeB2",
  "list": "typeD",
  "textArea": "typeD",
  "checkbox": "typeB2",
  "map": "typeA",
  "overall": "typeE"
};

export class DataExtractor {
  private _data: ReportData;

  constructor() {
    console.log(this);
  }

  public hello() {
    console.log("hello");
  }

  public printFiltered(data: any) {
    console.log(data);
  }

  public updateData(data: ReportData) {
    this._data = data;
    //Group the questions by type: this is for the sections
    const groupTypes = this._data.questions.reduce(function(groups, item){
        const val = item['controlType'];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
      }, {});
    // We need to create all the sections and the answers
    console.log(this._createRadioSections(groupTypes['stars']));
    //The map and the conclusions are handled differently
  }

  /**
   * Flattens the data to use only the labels and titles in the current lang
   * @param someObject
   * @private
   */
  private _selectLanguage(someObject: any) {
    const toVerify = ['title','subtitle', 'label', 'options'];
    toVerify.forEach(item=>{
      if(someObject && someObject[item]) {
        if(someObject[item] instanceof Array) {
          someObject[item].forEach((subItem:any)=>{
            subItem["label"] = subItem["label"][this._data.lang];
          });
        } else {
          someObject[item] = someObject[item][this._data.lang];
        }
      }
    })
  }

  /**
   * Search the professionals answers array for compiling all the answers to a specific question
   * @param questionIdentifier
   * @private
   */
  private _getAllAnswersForQuestion(questionIdentifier: string): Array<any> {
    return this._data.answers.map(answer=>{
      return answer.answers[questionIdentifier];
    });
  }

  /**
   * Creates radio and radio only sections :)
   * @param elements
   * @private
   */
  private _createRadioSections(elements: any) {
    const sections = Array<any>();
    elements.forEach((question: any)=>{
      sections.push(this._createOneRadioSection(question));
    });
    return sections;
  }

  /**
   * Creates radio and radio only ONE section :)
   * @param question
   * @private
   */
  private _createOneRadioSection(question: any) {
    const answers = this._getAllAnswersForQuestion(question.identifier);
    this._selectLanguage(question);
    const data = {
      type: templateMapping['radio'],
      sectionConfig: question
    };
    data['sectionConfig'].barData = this._reduceRadioAnswers(answers);
    data['sectionConfig'].conclusions = this._data.marketReport[question.identifier] || "";
    return data;
  }

  /**
   *
   * @param data
   * @private
   */
  private _reduceRadioAnswers(data: Array<string>): any {
    const length = data.length - data.filter(val=>{return !val}).length;
    return data.reduce((groups, item)=>{
      const val = item || '';
      if(val) {
        if(!groups[val]) {
          groups[val] = {
            count: 0,
            absolutePercentage: 0.0
          };
        }
        groups[val]["count"]++;
        groups[val].absolutePercentage += 1.0/length;
      }
      return groups;
    }, {});
  }

}