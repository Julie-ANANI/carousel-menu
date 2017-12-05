import { TestBed, inject } from '@angular/core/testing';

import { IndexService } from './email.service';

describe('EmailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndexService]
    });
  });

  it('should be created', inject([IndexService], (service: IndexService) => {
    expect(service).toBeTruthy();
  }));
});
