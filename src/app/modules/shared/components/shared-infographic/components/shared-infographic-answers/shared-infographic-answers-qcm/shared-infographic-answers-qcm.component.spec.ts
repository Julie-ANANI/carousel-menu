import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicAnswersQcmComponent } from './shared-infographic-answers-qcm.component';

describe('SharedInfographicAnswerQcmComponent', () => {
  let component: SharedInfographicAnswersQcmComponent;
  let fixture: ComponentFixture<SharedInfographicAnswersQcmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicAnswersQcmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicAnswersQcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
