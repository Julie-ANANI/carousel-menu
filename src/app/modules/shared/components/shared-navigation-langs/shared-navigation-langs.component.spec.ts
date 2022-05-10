import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNavigationLangsComponent } from './shared-navigation-langs.component';

describe('SharedNavigationLangsComponent', () => {
  let component: SharedNavigationLangsComponent;
  let fixture: ComponentFixture<SharedNavigationLangsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedNavigationLangsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedNavigationLangsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
