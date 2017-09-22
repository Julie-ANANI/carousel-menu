import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountSidenavComponent } from './client-account-sidenav.component';

describe('ClientAccountSidenavComponent', () => {
  let component: ClientAccountSidenavComponent;
  let fixture: ComponentFixture<ClientAccountSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientAccountSidenavComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAccountSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
