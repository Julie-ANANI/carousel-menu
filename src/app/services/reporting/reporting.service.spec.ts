import { TestBed, inject } from '@angular/core/testing';

import { ReportingService } from './reporting.service';

describe('PrintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportingService]
    });
  });

  it('should be created', inject([ReportingService], (service: ReportingService) => {
    expect(service).toBeTruthy();
  }));
});
