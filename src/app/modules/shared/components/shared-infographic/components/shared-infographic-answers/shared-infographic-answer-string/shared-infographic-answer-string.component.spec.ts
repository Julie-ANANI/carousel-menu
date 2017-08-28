import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicAnswerStringComponent } from './shared-infographic-answer-string.component';

describe('SharedInfographicAnswerComponent', () => {
  let component: SharedInfographicAnswerStringComponent;
  let fixture: ComponentFixture<SharedInfographicAnswerStringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicAnswerStringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicAnswerStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
