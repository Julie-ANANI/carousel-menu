import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRatingItemComponent } from './shared-rating-item.component';

describe('SharedRatingItemComponent', () => {
  let component: SharedRatingItemComponent;
  let fixture: ComponentFixture<SharedRatingItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedRatingItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRatingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
