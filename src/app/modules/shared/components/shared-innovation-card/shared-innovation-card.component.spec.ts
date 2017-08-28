import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInnovationCardComponent } from './shared-innovation-card.component';

describe('SharedInnovationCardComponent', () => {
  let component: SharedInnovationCardComponent;
  let fixture: ComponentFixture<SharedInnovationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInnovationCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInnovationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
