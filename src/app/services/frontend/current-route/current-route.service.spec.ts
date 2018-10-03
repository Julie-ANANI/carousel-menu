import { TestBed, inject } from '@angular/core/testing';

import { CurrentRouteService } from './current-route.service';

describe('CurrentRouteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentRouteService]
    });
  });

  it('should be created', inject([CurrentRouteService], (service: CurrentRouteService) => {
    expect(service).toBeTruthy();
  }));
});
