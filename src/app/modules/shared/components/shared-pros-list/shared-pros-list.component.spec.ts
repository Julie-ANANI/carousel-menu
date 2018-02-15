import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedProsListComponent } from './shared-pros-list.component';

describe('SharedProsListComponent', () => {
  let component: SharedProsListComponent;
  let fixture: ComponentFixture<SharedProsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedProsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedProsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
