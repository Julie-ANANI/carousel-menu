import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedProfessionalsListComponent } from './shared-professionals-list.component';

describe('SharedProsListComponent', () => {
  let component: SharedProfessionalsListComponent;
  let fixture: ComponentFixture<SharedProfessionalsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedProfessionalsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedProfessionalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
