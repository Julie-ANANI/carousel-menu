import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicAnswersComponent } from './shared-infographic-answers.component';

describe('SharedInfographicAnswersComponent', () => {
  let component: SharedInfographicAnswersComponent;
  let fixture: ComponentFixture<SharedInfographicAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
