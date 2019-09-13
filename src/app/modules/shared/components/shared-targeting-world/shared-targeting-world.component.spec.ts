import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTargetingWorldComponent } from './shared-targeting-world.component';

describe('SharedTargetingWorldComponent', () => {
  let component: SharedTargetingWorldComponent;
  let fixture: ComponentFixture<SharedTargetingWorldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTargetingWorldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTargetingWorldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
