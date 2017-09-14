import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFilterInputComponent } from './shared-filter-input.component';

describe('SharedFilterInputComponent', () => {
  let component: SharedFilterInputComponent;
  let fixture: ComponentFixture<SharedFilterInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedFilterInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedFilterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
