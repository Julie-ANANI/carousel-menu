import { Injectable } from '@angular/core';
import { Innovation, InnovationMetadataValues } from '../../models/innovation';

@Injectable()
export class FrontendService {

  private _innovationMetadataCalculatedValues: InnovationMetadataValues = {};

  constructor() {}

  /*
    Return the completion percentage of a project section (preparation, campaign or delivery)
   */
  calculateInnovationMetadataPercentages(project: Innovation, level: 'preparation' | 'campaign' | 'delivery') {
    if (project._metadata[level] !== undefined) {
      const keys = Object.keys(project._metadata[level]) || [];
      this._innovationMetadataCalculatedValues[level] = Math.round( (((keys.filter(value => project._metadata[level][value] === true && value !== 'anonymous_answers').length) * 100) / keys.length-1));
    } else {
      this._innovationMetadataCalculatedValues[level] = 0;
    }
  }

}
