import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAnswerComponent } from './user-answer.component';

describe('UserAnswerComponent', () => {
  let component: UserAnswerComponent;
  let fixture: ComponentFixture<UserAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
