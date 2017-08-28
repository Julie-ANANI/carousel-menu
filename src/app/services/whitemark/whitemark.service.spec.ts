import { TestBed, inject } from '@angular/core/testing';

import { WhitemarkService } from './whitemark.service';

describe('WhitemarkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WhitemarkService]
    });
  });

  it('should ...', inject([WhitemarkService], (service: WhitemarkService) => {
    expect(service).toBeTruthy();
  }));
});
