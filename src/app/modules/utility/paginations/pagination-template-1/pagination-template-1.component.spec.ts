import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationTemplate1Component } from './pagination-template-1.component';

describe('PaginationTemplate1Component', () => {
  let component: PaginationTemplate1Component;
  let fixture: ComponentFixture<PaginationTemplate1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationTemplate1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationTemplate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
