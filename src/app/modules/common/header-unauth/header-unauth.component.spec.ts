import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderUnauthComponent } from './header-unauth.component';

describe('HeaderUnauthComponent', () => {
  let component: HeaderUnauthComponent;
  let fixture: ComponentFixture<HeaderUnauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderUnauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderUnauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
