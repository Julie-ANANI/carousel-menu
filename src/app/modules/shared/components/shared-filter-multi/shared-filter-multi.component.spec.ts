import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFilterMultiComponent } from './shared-filter-multi.component';

describe('SharedFilterMultiComponent', () => {
  let component: SharedFilterMultiComponent;
  let fixture: ComponentFixture<SharedFilterMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedFilterMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedFilterMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
