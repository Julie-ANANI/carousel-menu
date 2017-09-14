import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPaginationComponent } from './shared-pagination.component';

describe('SharedPaginationComponent', () => {
  let component: SharedPaginationComponent;
  let fixture: ComponentFixture<SharedPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
