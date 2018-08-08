import { TestBed, inject } from '@angular/core/testing';

import { FrontendService } from './frontend.service';

describe('FrontendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrontendService]
    });
  });

  it('should be created', inject([FrontendService], (service: FrontendService) => {
    expect(service).toBeTruthy();
  }));
});
