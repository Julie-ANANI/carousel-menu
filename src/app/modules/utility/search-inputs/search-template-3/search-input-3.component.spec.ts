import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInput3Component } from './search-input-3.component';

describe('SearchInput3Component', () => {
  let component: SearchInput3Component;
  let fixture: ComponentFixture<SearchInput3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchInput3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInput3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
