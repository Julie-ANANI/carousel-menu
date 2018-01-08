import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuestionNewComponent } from './admin-question-new.component';

describe('AdminQuestionNewComponent', () => {
  let component: AdminQuestionNewComponent;
  let fixture: ComponentFixture<AdminQuestionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuestionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuestionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
