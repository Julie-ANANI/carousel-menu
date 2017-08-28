import { TestBed, inject } from '@angular/core/testing';

import { InnovationService } from './innovation.service';

describe('InnovationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InnovationService]
    });
  });

  it('should ...', inject([InnovationService], (service: InnovationService) => {
    expect(service).toBeTruthy();
  }));
});
