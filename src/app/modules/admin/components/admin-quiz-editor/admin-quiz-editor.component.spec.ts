import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuizEditorComponent } from './admin-quiz-editor.component';

describe('AdminQuizEditorComponent', () => {
  let component: AdminQuizEditorComponent;
  let fixture: ComponentFixture<AdminQuizEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuizEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuizEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
