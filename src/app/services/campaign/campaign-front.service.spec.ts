import { TestBed, inject } from '@angular/core/testing';

import { CampaignFrontService } from './campaign-front.service';

describe('CampaignFrontService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignFrontService]
    });
  });

  it('should be created', inject([CampaignFrontService], (service: CampaignFrontService) => {
    expect(service).toBeTruthy();
  }));
});
