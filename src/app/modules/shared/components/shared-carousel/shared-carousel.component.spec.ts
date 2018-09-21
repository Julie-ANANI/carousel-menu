import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCarouselComponent } from './shared-carousel.component';

describe('SharedCarouselComponent', () => {
  let component: SharedCarouselComponent;
  let fixture: ComponentFixture<SharedCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
