import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSearchMultiComponent } from './shared-search-multi.component';

describe('SharedFilterMultiComponent', () => {
  let component: SharedSearchMultiComponent;
  let fixture: ComponentFixture<SharedSearchMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedSearchMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSearchMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
