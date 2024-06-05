import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { ReservationService } from '../services/reservation.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Reservation } from '../models/Reservation';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})

export class ReservationComponent implements OnInit{

  reservationForm!: FormGroup;
  emailRegex!: RegExp;
  isFormSubmitted: boolean = false;
  showSuccessMessage: boolean = false;
  reservation!: Reservation;


  constructor(private formBuilder: FormBuilder, private reservationService: ReservationService){

  }

  ngOnInit(): void {
      this.emailRegex = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
      this.reservationForm = this.formBuilder.group({
        familyName: [null, Validators.required],
        firstName: [null, Validators.required],
        email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
        numberOfPersons: [null, Validators.required],
        reservationDateString: [null, Validators.required]
      });
  }


  onSubmitForm(): void {
    console.log(this.reservationForm.value);
    this.showSuccessMessage = true;
    console.log(this.showSuccessMessage);
    this.reservationService.createReservation(this.reservationForm.value).subscribe(
      (reservation) => this.reservation = reservation,
    );
    if(this.reservation){
      this.showSuccessMessage = true;
    }
  }
}
