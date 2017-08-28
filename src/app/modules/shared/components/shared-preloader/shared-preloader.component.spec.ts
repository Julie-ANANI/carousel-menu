import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPreloaderComponent } from './shared-preloader.component';

describe('SharedPreloaderComponent', () => {
  let component: SharedPreloaderComponent;
  let fixture: ComponentFixture<SharedPreloaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPreloaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPreloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
