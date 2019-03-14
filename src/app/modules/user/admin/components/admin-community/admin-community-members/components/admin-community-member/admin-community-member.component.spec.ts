import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommunityMemberComponent } from './admin-community-member.component';

describe('AdminCommunityMemberComponent', () => {
  let component: AdminCommunityMemberComponent;
  let fixture: ComponentFixture<AdminCommunityMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCommunityMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCommunityMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
