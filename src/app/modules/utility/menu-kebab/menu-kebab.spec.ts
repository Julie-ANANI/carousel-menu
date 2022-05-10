import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuKebabComponent } from './menu-kebab.component';

describe('SharedNavigationLangsComponent', () => {
  let component: MenuKebabComponent;
  let fixture: ComponentFixture<MenuKebabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuKebabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuKebabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
