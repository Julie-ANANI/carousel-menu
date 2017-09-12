import { TestBed, inject } from '@angular/core/testing';

import { SmartQueryService } from './smartQuery.service';
import { Http } from '../http';

describe('SmartQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartQueryService, Http]
    });
  });

  it('should ...', inject([SmartQueryService], (service: SmartQueryService) => {
    expect(service).toBeTruthy();
  }));
});
