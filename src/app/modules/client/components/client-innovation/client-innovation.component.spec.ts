import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInnovationComponent } from './client-innovation-card.component';

describe('ClientInnovationComponent', () => {
  let component: ClientInnovationComponent;
  let fixture: ComponentFixture<ClientInnovationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInnovationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInnovationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
