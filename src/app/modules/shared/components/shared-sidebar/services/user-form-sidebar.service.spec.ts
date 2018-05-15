import { TestBed, inject } from '@angular/core/testing';

import { UserFormSidebarService } from './user-form-sidebar.service';

describe('UserFormSidebarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFormSidebarService]
    });
  });

  it('should be created', inject([UserFormSidebarService], (service: UserFormSidebarService) => {
    expect(service).toBeTruthy();
  }));
});
