import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuestionEditComponent } from './admin-question-edit.component';

describe('AdminQuestionEditComponent', () => {
  let component: AdminQuestionEditComponent;
  let fixture: ComponentFixture<AdminQuestionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuestionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuestionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
