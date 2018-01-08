import { TestBed, inject } from '@angular/core/testing';

import { PresetService } from './preset.service';

describe('PresetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PresetService]
    });
  });

  it('should ...', inject([PresetService], (service: PresetService) => {
    expect(service).toBeTruthy();
  }));
});
