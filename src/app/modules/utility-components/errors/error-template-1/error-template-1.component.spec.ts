import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorTemplate1Component } from './error-template-1.component';

describe('MessageSpaceComponent', () => {
  let component: ErrorTemplate1Component;
  let fixture: ComponentFixture<ErrorTemplate1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorTemplate1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorTemplate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
