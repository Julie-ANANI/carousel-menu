import { TestBed, inject } from '@angular/core/testing';

import { CampaignCalculationService } from './campaign-calculation.service';

describe('CampaignCalculationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignCalculationService]
    });
  });

  it('should be created', inject([CampaignCalculationService], (service: CampaignCalculationService) => {
    expect(service).toBeTruthy();
  }));
});
