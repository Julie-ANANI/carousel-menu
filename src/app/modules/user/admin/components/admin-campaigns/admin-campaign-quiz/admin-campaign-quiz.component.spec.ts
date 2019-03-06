import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampaignQuizComponent } from './admin-campaign-quiz.component';

describe('AdminCampaignQuizComponent', () => {
  let component: AdminCampaignQuizComponent;
  let fixture: ComponentFixture<AdminCampaignQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCampaignQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampaignQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
