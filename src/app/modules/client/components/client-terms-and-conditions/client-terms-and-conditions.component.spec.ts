import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTermsAndConditionsComponent } from './client-terms-and-conditions.component';

describe('ClientTermsAndConditionsComponent', () => {
  let component: ClientTermsAndConditionsComponent;
  let fixture: ComponentFixture<ClientTermsAndConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTermsAndConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
