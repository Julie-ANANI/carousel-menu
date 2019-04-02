import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommunityProjectComponent } from './admin-community-project.component';

describe('AdminCommunityMemberComponent', () => {
  let component: AdminCommunityProjectComponent;
  let fixture: ComponentFixture<AdminCommunityProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCommunityProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCommunityProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
