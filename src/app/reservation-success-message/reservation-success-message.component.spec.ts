import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationSuccessMessageComponent } from './reservation-success-message.component';

describe('ReservationSuccessMessageComponent', () => {
  let component: ReservationSuccessMessageComponent;
  let fixture: ComponentFixture<ReservationSuccessMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationSuccessMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationSuccessMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
