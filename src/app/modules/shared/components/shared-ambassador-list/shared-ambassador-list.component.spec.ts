import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAmbassadorListComponent } from './shared-ambassador-list.component';

describe('SharedProsListComponent', () => {
  let component: SharedAmbassadorListComponent;
  let fixture: ComponentFixture<SharedAmbassadorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedAmbassadorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAmbassadorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
