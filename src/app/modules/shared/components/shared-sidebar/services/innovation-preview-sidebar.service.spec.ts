import { TestBed, inject } from '@angular/core/testing';

import { InnovationPreviewSidebarService } from './innovation-preview-sidebar.service';

describe('InnovationPreviewSidebarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InnovationPreviewSidebarService]
    });
  });

  it('should be created', inject([InnovationPreviewSidebarService], (service: InnovationPreviewSidebarService) => {
    expect(service).toBeTruthy();
  }));
});
