import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMainPageComponent } from './shared-main-page.component';

describe('SharedMainPageComponent', () => {
  let component: SharedMainPageComponent;
  let fixture: ComponentFixture<SharedMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
