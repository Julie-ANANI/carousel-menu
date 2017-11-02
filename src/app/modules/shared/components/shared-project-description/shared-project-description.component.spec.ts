import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedProjectDescriptionComponent } from './shared-project-description.component';

describe('SharedProjectDescriptionComponent', () => {
  let component: SharedProjectDescriptionComponent;
  let fixture: ComponentFixture<SharedProjectDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedProjectDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedProjectDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
