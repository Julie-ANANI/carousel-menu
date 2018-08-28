import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMailEditorComponent } from './shared-mail-editor.component';

describe('SharedMailEditorComponent', () => {
  let component: SharedMailEditorComponent;
  let fixture: ComponentFixture<SharedMailEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedMailEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedMailEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
