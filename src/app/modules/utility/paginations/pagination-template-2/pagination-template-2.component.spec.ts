import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationTemplate2Component } from './pagination-template-2.component';

describe('PaginationTemplate1Component', () => {
  let component: PaginationTemplate2Component;
  let fixture: ComponentFixture<PaginationTemplate2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationTemplate2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationTemplate2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
