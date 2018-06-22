import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSidebarComponent } from './generic-sidebar.component';

describe('GenericSidebarComponent', () => {
  let component: GenericSidebarComponent;
  let fixture: ComponentFixture<GenericSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
