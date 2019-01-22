import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampaignAnswersComponent } from './admin-campaign-answers.component';

describe('AdminCampaignAnswersComponent', () => {
  let component: AdminCampaignAnswersComponent;
  let fixture: ComponentFixture<AdminCampaignAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCampaignAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampaignAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
