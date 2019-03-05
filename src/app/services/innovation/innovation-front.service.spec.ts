import { TestBed } from '@angular/core/testing';

import { InnovationFrontService } from './innovation-front.service';

describe('InnovationFrontService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InnovationFrontService = TestBed.get(InnovationFrontService);
    expect(service).toBeTruthy();
  });
});
