import { TestBed, inject } from '@angular/core/testing';

import { InnovationCommonService } from './innovation-common.service';

describe('InnovationCommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InnovationCommonService]
    });
  });

  it('should be created', inject([InnovationCommonService], (service: InnovationCommonService) => {
    expect(service).toBeTruthy();
  }));
});
